// Parse a GHL / HighConversionHub call-export CSV into normalized CallRecords.
// Column reference (brief §5):
//   Date & time, Contact name, Contact phone, Marketing campaign, Number name,
//   Number phone, Source type, Direction, Call status, Disposition, First time,
//   Keyword, Referrer, Campaign, Duration, Device type, Qualified lead,
//   Landing page, From, To
// Notes: Duration is "MM:SS" or "-"; missing values are "-", not empty;
//        "Number name" is the client account; "First time" is Yes/No.

import { CallRecord, CallDirection } from "./types";

/** Duration "MM:SS" | "M:SS" | "-" | "" | "123" -> seconds, or null when missing. */
export function parseDuration(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s === "" || s === "-") return null;
  const mmss = s.match(/^(\d+):([0-5]?\d)$/);
  if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2]);
  if (/^\d+$/.test(s)) return Number(s);
  return null;
}

const dash = (v: string): string | null => {
  const s = v.trim();
  return s === "" || s === "-" ? null : s;
};

function normalizeDirection(v: string): CallDirection {
  return v.trim().toLowerCase() === "inbound" ? "inbound" : "outbound";
}

/** Minimal RFC-4180 CSV parser (handles quoted fields, escaped quotes, CRLF). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/**
 * Parse a raw call-export CSV into CallRecords. `dateTime` is taken verbatim from
 * "Date & time" and treated as account-local (brief §7). Extra/renamed columns
 * are tolerated as long as the header row names the columns above.
 */
export function parseGhlCallExport(csvText: string): CallRecord[] {
  const rows = parseCsv(csvText);
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);
  const col = {
    dateTime: idx("Date & time"),
    contactPhone: idx("Contact phone"),
    numberName: idx("Number name"),
    direction: idx("Direction"),
    callStatus: idx("Call status"),
    disposition: idx("Disposition"),
    firstTime: idx("First time"),
    duration: idx("Duration"),
  };
  const get = (r: string[], i: number) => (i >= 0 && i < r.length ? r[i] : "");

  return rows.slice(1).map((r) => ({
    dateTime: get(r, col.dateTime).trim(),
    contactPhone: dash(get(r, col.contactPhone)),
    accountName: dash(get(r, col.numberName)),
    setterName: null,
    direction: normalizeDirection(get(r, col.direction)),
    callStatus: dash(get(r, col.callStatus)),
    disposition: dash(get(r, col.disposition)), // blank preserved as null
    durationSeconds: parseDuration(get(r, col.duration)),
    firstTime: get(r, col.firstTime).trim().toLowerCase() === "yes",
    workflowName: null,
  }));
}
