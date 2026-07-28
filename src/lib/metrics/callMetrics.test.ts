import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  parseGhlCallExport,
  parseDuration,
  computeCallMetrics,
  countAttempts,
  isConnect,
  isConversation,
  isSubstantiveDisposition,
  speedToLeadMinutes,
  isSpeedToLeadBreach,
} from "./index";
import type { CallRecord } from "./index";

// Ground-truth fixture: brief §5 (Rich Investor Capital, 2026-07-22 → 28).
// This fixture reproduces every §5 distribution. Swap it for the real CRM export
// and these assertions still hold — that is the point of the metric contract.
const csv = readFileSync(
  resolve(__dirname, "../../../fixtures/rich_investor_capital_2026-07-22_28.csv"),
  "utf8",
);
const records = parseGhlCallExport(csv);

const outbound = records.filter((r) => r.direction === "outbound");
const byDay = (d: string) =>
  outbound.filter((r) => r.dateTime.slice(0, 10) === d).length;
const statusCount = (s: string) =>
  records.filter((r) => (r.callStatus ?? "") === s).length;
const dispCount = (d: string | null) =>
  records.filter((r) => r.disposition === d).length;

describe("§5 ground-truth totals", () => {
  it("record counts", () => {
    expect(records.length).toBe(164);
    expect(outbound.length).toBe(162);
    expect(records.filter((r) => r.direction === "inbound").length).toBe(2);
  });

  it("call status distribution", () => {
    expect(statusCount("Answered")).toBe(135);
    expect(statusCount("No answer")).toBe(13);
    expect(statusCount("Failed")).toBe(9);
    expect(statusCount("Busy")).toBe(6);
    expect(statusCount("Voicemail")).toBe(1);
  });

  it("disposition distribution (blank preserved, not coerced)", () => {
    expect(dispCount(null)).toBe(85); // 52% blank — the write-back defect
    expect(dispCount("No Answer")).toBe(77);
    expect(dispCount("Not Interested")).toBe(1);
    expect(dispCount("Voicemail")).toBe(1);
  });

  it("outbound dials by day (zero on 07-25)", () => {
    expect(byDay("2026-07-22")).toBe(75);
    expect(byDay("2026-07-23")).toBe(3);
    expect(byDay("2026-07-24")).toBe(2);
    expect(byDay("2026-07-25")).toBe(0);
    expect(byDay("2026-07-26")).toBe(3);
    expect(byDay("2026-07-27")).toBe(7);
    expect(byDay("2026-07-28")).toBe(72);
  });
});

describe("§5 derived metrics", () => {
  const m = computeCallMetrics(records);

  it("conversations (>=60s or substantive disposition) = 6", () => {
    expect(m.conversations).toBe(6);
  });
  it("contact rate = 3.7%", () => {
    expect(Math.round(m.contactRate * 1000) / 10).toBe(3.7);
  });
  it("calls <=15s = 131 (81%)", () => {
    expect(m.callsLe15s).toBe(131);
    expect(Math.round((m.callsLe15s / m.dials) * 100)).toBe(81);
  });
  it("coverage = 6 of 7 days", () => {
    expect(m.coverageDays).toBe(6);
  });
  it("working set = 42 unique contacts", () => {
    expect(m.workingSet).toBe(42);
  });
  it("attempts are substantially fewer than dials (spacing rule applied)", () => {
    expect(m.attempts).toBeLessThan(m.dials);
  });
});

describe("§4 definitions — unit", () => {
  it("Duration parsing: MM:SS, plain seconds, and missing '-'", () => {
    expect(parseDuration("01:30")).toBe(90);
    expect(parseDuration("0:07")).toBe(7);
    expect(parseDuration("45")).toBe(45);
    expect(parseDuration("-")).toBeNull();
    expect(parseDuration("")).toBeNull();
  });

  it("Connect requires >= 20s (16-19s is NOT a connect)", () => {
    const mk = (d: number): CallRecord => ({
      dateTime: "2026-07-22 13:00:00",
      contactPhone: "+1",
      direction: "outbound",
      callStatus: "Answered",
      disposition: null,
      durationSeconds: d,
    });
    expect(isConnect(mk(19))).toBe(false);
    expect(isConnect(mk(20))).toBe(true);
  });

  it("Conversation from a substantive disposition even when short", () => {
    const base: CallRecord = {
      dateTime: "2026-07-22 13:00:00",
      contactPhone: "+1",
      direction: "outbound",
      callStatus: "Answered",
      disposition: "Not Interested",
      durationSeconds: 8,
    };
    expect(isConversation(base)).toBe(true);
    expect(isSubstantiveDisposition("No Answer")).toBe(false);
    expect(isSubstantiveDisposition("Voicemail")).toBe(false);
    expect(isSubstantiveDisposition(null)).toBe(false);
    expect(isSubstantiveDisposition("Not Interested")).toBe(true);
  });

  it("callStatus 'Answered' is NOT treated as a conversation on its own", () => {
    const answeredButShort: CallRecord = {
      dateTime: "2026-07-22 13:00:00",
      contactPhone: "+1",
      direction: "outbound",
      callStatus: "Answered", // carrier connected to voicemail
      disposition: null,
      durationSeconds: 7,
    };
    expect(isConversation(answeredButShort)).toBe(false);
  });

  it("Attempts collapse sub-30-minute redials to the same contact", () => {
    const mk = (min: number): CallRecord => ({
      dateTime: new Date(Date.UTC(2026, 6, 22, 13, min, 0)).toISOString(),
      contactPhone: "+1555",
      direction: "outbound",
      callStatus: "No answer",
      disposition: null,
      durationSeconds: 3,
    });
    // dials at t=0, +0.5, +5 min -> one attempt; add +35 min -> two attempts.
    expect(countAttempts([mk(0), mk(0), mk(5)])).toBe(1);
    expect(countAttempts([mk(0), mk(0), mk(5), mk(40)])).toBe(2);
  });
});

describe("§4/§6 speed to lead", () => {
  it("computes elapsed minutes and flags breaches over 5 min", () => {
    const m = speedToLeadMinutes({
      createdAt: "2026-07-22 09:05:00",
      firstDialAt: "2026-07-25 11:10:00",
    });
    // ~3 days 2h 5m breach — the confirmed case in the brief.
    expect(m).toBe(4445);
    expect(isSpeedToLeadBreach(m)).toBe(true);
    expect(isSpeedToLeadBreach(4)).toBe(false);
  });

  it("returns null when there is no first dial", () => {
    expect(
      speedToLeadMinutes({ createdAt: "2026-07-22 09:05:00", firstDialAt: null }),
    ).toBeNull();
  });
});
