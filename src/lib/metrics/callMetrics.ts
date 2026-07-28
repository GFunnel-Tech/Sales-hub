// Binding metric definitions — brief §4. This module is the single source of
// truth for how a "dial", "connect", "conversation", "attempt", etc. are counted.
// One wrong definition here invalidates every downstream report, so this file is
// covered by `callMetrics.test.ts` against the §5 ground-truth fixture.
//
// 🔴 Never derive contact/answer from `callStatus`. GHL "Answered" includes
//    carrier connection to voicemail. Always use duration + disposition.

import {
  CallRecord,
  CallMetrics,
  LeadRecord,
  NON_SUBSTANTIVE_DISPOSITIONS,
} from "./types";

const THIRTY_MIN_MS = 30 * 60 * 1000;

export const isOutbound = (r: CallRecord): boolean =>
  String(r.direction).toLowerCase() === "outbound";

/** A disposition that reflects a real human conversation (not blank/no-answer/vm). */
export function isSubstantiveDisposition(disposition: string | null): boolean {
  if (disposition == null) return false;
  return !NON_SUBSTANTIVE_DISPOSITIONS.has(disposition.trim().toLowerCase());
}

/** Connect: outbound call with duration >= 20s. */
export const isConnect = (r: CallRecord): boolean =>
  isOutbound(r) && r.durationSeconds != null && r.durationSeconds >= 20;

/** Conversation: outbound >= 60s, OR any call carrying a substantive disposition. */
export const isConversation = (r: CallRecord): boolean =>
  isOutbound(r) &&
  ((r.durationSeconds != null && r.durationSeconds >= 60) ||
    isSubstantiveDisposition(r.disposition));

/** Account-local calendar day (YYYY-MM-DD) for coverage bucketing. Records are
 *  expected to already carry account-local timestamps (see CallRecord.dateTime). */
export const localDay = (isoLocal: string): string => isoLocal.slice(0, 10);

/**
 * Attempts: distinct outbound touches to a contact, collapsing redials that are
 * < 30 minutes after the prior dial to the same contact (brief §4). Sub-minute
 * redials are NOT second attempts. Returns the total across all contacts.
 */
export function countAttempts(records: CallRecord[]): number {
  const byContact = new Map<string, number[]>();
  for (const r of records) {
    if (!isOutbound(r) || !r.contactPhone) continue;
    const t = new Date(r.dateTime).getTime();
    if (Number.isNaN(t)) continue;
    const arr = byContact.get(r.contactPhone) ?? [];
    arr.push(t);
    byContact.set(r.contactPhone, arr);
  }
  let total = 0;
  for (const times of byContact.values()) {
    times.sort((a, b) => a - b);
    let lastAttempt = -Infinity;
    for (const t of times) {
      if (t - lastAttempt >= THIRTY_MIN_MS) {
        total += 1;
        lastAttempt = t;
      }
    }
  }
  return total;
}

/** Outbound calls <= 15s (carrier pickup, voicemail, or immediate hangup). */
export const countCallsLe15s = (records: CallRecord[]): number =>
  records.filter(
    (r) => isOutbound(r) && r.durationSeconds != null && r.durationSeconds <= 15,
  ).length;

/** Distinct account-local days with >= 1 outbound dial. */
export function coverageDays(records: CallRecord[]): number {
  const days = new Set<string>();
  for (const r of records) if (isOutbound(r)) days.add(localDay(r.dateTime));
  return days.size;
}

/** Distinct contacts dialed (outbound) in the period. */
export function workingSet(records: CallRecord[]): number {
  const phones = new Set<string>();
  for (const r of records) if (isOutbound(r) && r.contactPhone) phones.add(r.contactPhone);
  return phones.size;
}

/** Compute the full binding metric set for a set of (already-scoped) records. */
export function computeCallMetrics(records: CallRecord[]): CallMetrics {
  const outbound = records.filter(isOutbound);
  const dials = outbound.length;
  const conversations = outbound.filter(isConversation).length;
  return {
    dials,
    connects: outbound.filter(isConnect).length,
    conversations,
    contactRate: dials ? conversations / dials : 0,
    attempts: countAttempts(records),
    workingSet: workingSet(records),
    coverageDays: coverageDays(records),
    callsLe15s: countCallsLe15s(records),
  };
}

/**
 * Speed to lead (minutes) from contact creation to first outbound dial, counted
 * ONLY within staffed hours (brief §4). `staffed` decides whether a given instant
 * is inside a staffed window; when omitted, elapsed wall-clock minutes are used.
 * Returns null if there is no first dial.
 */
export function speedToLeadMinutes(
  lead: Pick<LeadRecord, "createdAt" | "firstDialAt">,
  staffed?: (instant: Date) => boolean,
): number | null {
  if (!lead.firstDialAt) return null;
  const start = new Date(lead.createdAt).getTime();
  const end = new Date(lead.firstDialAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  if (!staffed) return Math.round((end - start) / 60000);
  // Walk minute-by-minute counting only staffed minutes. Coarse but exact enough
  // for exception alerting; a production impl can integrate window overlaps.
  let staffedMs = 0;
  for (let t = start; t < end; t += 60000) {
    if (staffed(new Date(t))) staffedMs += 60000;
  }
  return Math.round(staffedMs / 60000);
}

/** Speed-to-lead breach detector (brief §6). Default threshold 5 minutes. */
export const isSpeedToLeadBreach = (minutes: number | null, thresholdMin = 5): boolean =>
  minutes != null && minutes > thresholdMin;
