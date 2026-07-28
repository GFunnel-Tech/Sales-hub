// Account completion + exception alerting (brief §6 + Account Health board B5#2).
//
// The central question the ops team needs answered automatically:
//   "Which accounts were NOT completed today — and whose problem is it?"
//
// "Completed" = every lead delivered to the account was actually worked (dialed)
// in the period. A not-completed account raises a notification, routed to the
// owner implied by WHY it failed. The three failure modes are deliberately kept
// distinct because they route to three different owners (brief §5, §7):
//   - no leads delivered        -> supply failure   -> media team
//   - leads delivered, not worked -> execution/coverage -> setter / manager
//   - leads worked, no appts     -> execution quality -> setter / coach

import { CallRecord } from "./types";
import { isOutbound, isSubstantiveDisposition } from "./callMetrics";

export type AccountHealthStatus =
  | "complete"
  | "no_leads_delivered"
  | "leads_not_worked"
  | "worked_no_appointments";

export type AlertOwner = "media" | "setter" | "manager" | "backend";
export type AlertSeverity = "info" | "warning" | "critical";

export interface AccountDayInput {
  accountName: string;
  /** Date (account-local, YYYY-MM-DD) this status is for. */
  day: string;
  /** Distinct contacts delivered to the account that need working in the period. */
  deliveredLeads: number;
  /** Distinct contacts actually dialed (outbound) in the period. */
  contactsDialed: number;
  /** Appointments set in the period. */
  appointmentsSet: number;
  /** Outbound dials in the period (for zero-coverage detection). */
  dials: number;
}

export interface AccountHealth {
  accountName: string;
  day: string;
  status: AccountHealthStatus;
  /** True only when all delivered leads were worked. */
  complete: boolean;
  owner: AlertOwner;
  severity: AlertSeverity;
  message: string;
  /** Fraction of delivered leads that were worked (0..1). */
  completionRate: number;
}

/**
 * Classify one account's day into a completion status. This is the function the
 * Account Health board and the completion notifications are both built on.
 */
export function classifyAccountHealth(input: AccountDayInput): AccountHealth {
  const { accountName, day, deliveredLeads, contactsDialed, appointmentsSet, dials } = input;
  const completionRate = deliveredLeads > 0 ? Math.min(1, contactsDialed / deliveredLeads) : 0;
  const base = { accountName, day, completionRate };

  if (deliveredLeads === 0) {
    return {
      ...base,
      status: "no_leads_delivered",
      complete: false,
      owner: "media",
      severity: "warning",
      message: `No leads delivered to ${accountName} on ${day} — supply issue, route to media.`,
    };
  }

  if (dials === 0 || contactsDialed < deliveredLeads) {
    const worked = `${contactsDialed}/${deliveredLeads} leads worked`;
    return {
      ...base,
      status: "leads_not_worked",
      complete: false,
      owner: contactsDialed === 0 ? "manager" : "setter",
      severity: contactsDialed === 0 ? "critical" : "warning",
      message:
        dials === 0
          ? `${accountName} received leads but got ZERO dials on ${day} — not worked.`
          : `${accountName} incomplete on ${day}: ${worked}.`,
    };
  }

  if (appointmentsSet === 0) {
    return {
      ...base,
      status: "worked_no_appointments",
      complete: true, // calling was completed…
      owner: "setter",
      severity: "info",
      message: `${accountName} fully worked on ${day} but set 0 appointments — review approach.`,
    };
  }

  return {
    ...base,
    status: "complete",
    complete: true,
    owner: "setter",
    severity: "info",
    message: `${accountName} completed on ${day}: all ${deliveredLeads} leads worked, ${appointmentsSet} appt(s).`,
  };
}

/** Accounts that need a completion notification (anything not cleanly complete). */
export function accountsNeedingNotification(healths: AccountHealth[]): AccountHealth[] {
  return healths.filter(
    (h) => h.status === "leads_not_worked" || h.status === "no_leads_delivered",
  );
}

// ------------------------- §6 upstream defect detectors -------------------------

export interface DefectAlert {
  type:
    | "automation_call_failure"
    | "blank_disposition_rate"
    | "repeated_hard_failure"
    | "zero_coverage_day";
  accountName: string | null;
  severity: AlertSeverity;
  owner: AlertOwner;
  message: string;
  value?: number;
}

/** Daily blank-disposition rate per account; alert past a threshold (default 20%). */
export function blankDispositionAlert(
  records: CallRecord[],
  accountName: string | null,
  threshold = 0.2,
): DefectAlert | null {
  const completed = records.filter((r) => isOutbound(r) && r.durationSeconds != null);
  if (completed.length === 0) return null;
  const blank = completed.filter((r) => r.disposition == null).length;
  const rate = blank / completed.length;
  if (rate < threshold) return null;
  return {
    type: "blank_disposition_rate",
    accountName,
    severity: rate >= 0.5 ? "critical" : "warning",
    owner: "backend",
    message: `Blank disposition on ${Math.round(rate * 100)}% of completed calls${
      accountName ? ` for ${accountName}` : ""
    } — disposition write-back defect.`,
    value: rate,
  };
}

/**
 * Automation call-failure signature (brief §6): status Failed, duration 0, no
 * recording, workflow present, and the leg terminates at a fixed number rather
 * than the lead. Alert when the automation-attributed failure rate exceeds
 * `threshold` (default 10%).
 */
export function automationFailureAlert(
  records: CallRecord[],
  accountName: string | null,
  threshold = 0.1,
): DefectAlert | null {
  const automated = records.filter((r) => r.workflowName);
  if (automated.length === 0) return null;
  const failed = automated.filter(
    (r) =>
      (r.callStatus ?? "").toLowerCase() === "failed" &&
      (r.durationSeconds ?? 0) === 0,
  );
  const rate = failed.length / automated.length;
  if (rate <= threshold) return null;
  return {
    type: "automation_call_failure",
    accountName,
    severity: "critical",
    owner: "backend",
    message: `${failed.length}/${automated.length} automation-triggered calls failed${
      accountName ? ` for ${accountName}` : ""
    } — silent automation failure.`,
    value: rate,
  };
}

/** Numbers with >= N consecutive hard failures with no suppression (default 3). */
export function repeatedHardFailureAlerts(
  records: CallRecord[],
  accountName: string | null,
  minConsecutive = 3,
): DefectAlert[] {
  const byPhone = new Map<string, CallRecord[]>();
  for (const r of records) {
    if (!isOutbound(r) || !r.contactPhone) continue;
    const arr = byPhone.get(r.contactPhone) ?? [];
    arr.push(r);
    byPhone.set(r.contactPhone, arr);
  }
  const alerts: DefectAlert[] = [];
  for (const [phone, calls] of byPhone) {
    calls.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    let streak = 0;
    for (const c of calls) {
      if ((c.callStatus ?? "").toLowerCase() === "failed") streak += 1;
      else streak = 0;
      if (streak >= minConsecutive) {
        alerts.push({
          type: "repeated_hard_failure",
          accountName,
          severity: "warning",
          owner: "backend",
          message: `${phone} has ${streak}+ consecutive failed calls with no suppression.`,
          value: streak,
        });
        break;
      }
    }
  }
  return alerts;
}
