// Normalized call/lead/appointment records and the metric contract.
// snake_case in the database, camelCase in TypeScript (repo convention).
//
// These types are the boundary between raw GHL/CRM data and the metric layer.
// The metric functions in `callMetrics.ts` operate ONLY on these shapes, so the
// same definitions apply whether rows come from a CSV export or the GHL API.

export type CallDirection = "outbound" | "inbound";

/** One normalized call fact. Mirrors `fact_call` (see the GHL reporting migration). */
export interface CallRecord {
  /** ISO timestamp of when the call was initiated, in the ACCOUNT-LOCAL timezone.
   *  Coverage/day bucketing is account-local by design (brief §7). */
  dateTime: string;
  contactPhone: string | null;
  /** Client account key. Free-text account name today; a real key post-sync. */
  accountName?: string | null;
  /** Setter key. Free-text today; a real setter id post-sync. */
  setterName?: string | null;
  direction: CallDirection;
  /** GHL "Call status" — carrier connection incl. voicemail. NEVER an answer rate. */
  callStatus: string | null;
  /** Selected disposition. `null`/blank is meaningful (52% write-back defect) and
   *  must be preserved, never coerced to a default (brief §5). */
  disposition: string | null;
  /** Seconds. `null` = missing ("-" in the export), which is distinct from 0. */
  durationSeconds: number | null;
  firstTime?: boolean;
  workflowName?: string | null;
}

/** One normalized lead/contact. Speed-to-lead needs `createdAt` (from Contacts). */
export interface LeadRecord {
  contactId: string;
  accountName?: string | null;
  createdAt: string;
  firstDialAt?: string | null;
  source?: string | null;
  currentStage?: string | null;
}

/** The binding metric set for a period, per one scope (account and/or setter). */
export interface CallMetrics {
  /** Any outbound attempt initiated. Denominator only, never a target. */
  dials: number;
  /** Outbound with duration >= 20s. */
  connects: number;
  /** Outbound with duration >= 60s, OR any call with a substantive disposition. */
  conversations: number;
  /** conversations / dials (0..1). */
  contactRate: number;
  /** Attempts after collapsing sub-30-minute redials to the same contact. */
  attempts: number;
  /** Distinct contacts dialed in the period. */
  workingSet: number;
  /** Distinct account-local days with >= 1 outbound dial. */
  coverageDays: number;
  /** Convenience: outbound calls <= 15s (carrier pickup / immediate hangup). */
  callsLe15s: number;
}

/** Dispositions that do NOT count as a substantive human conversation. */
export const NON_SUBSTANTIVE_DISPOSITIONS = new Set([
  "",
  "no answer",
  "voicemail",
]);
