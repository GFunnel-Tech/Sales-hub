import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memberApi } from "@/lib/memberApi";
import { toast } from "sonner";
import { History, Search, ExternalLink, Loader2 } from "lucide-react";

export interface Lead {
  id: string;
  agent: string | null;
  date_contacted: string | null;
  outcome: string | null;
  notes: string | null;
  lead_name: string | null;
  last_point_of_contact: string | null;
  interested: string | null;
  appointment_booked: boolean;
  time_zone: string | null;
  ghl_link: string | null;
  updated_at: string;
}

interface Edit {
  id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  edited_by_label: string | null;
  edited_at: string;
}

const OUTCOMES = ["No answer", "Answered", "Meeting Booked", "Not interested", "Voicemail", "Wrong number", "Callback"];
const INTERESTED = ["", "Yes", "No", "Maybe"];

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [savingCell, setSavingCell] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState<Lead | null>(null);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [editsLoading, setEditsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const { leads } = await memberApi.listLeads();
      setLeads(leads || []);
    } catch (e) {
      toast.error("Failed to load leads");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function saveField(lead: Lead, field: keyof Lead, value: unknown) {
    const current = lead[field];
    if (String(current ?? "") === String(value ?? "")) return;
    const key = `${lead.id}:${field}`;
    setSavingCell(key);
    try {
      const { lead: updated } = await memberApi.updateLead(lead.id, { [field]: value });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, ...updated } : l)));
      toast.success("Saved", { description: `${field} updated` });
    } catch (e) {
      toast.error("Save failed");
      console.error(e);
    } finally {
      setSavingCell(null);
    }
  }

  async function openHistory(lead: Lead) {
    setHistoryOpen(lead);
    setEditsLoading(true);
    try {
      const { edits } = await memberApi.getLeadHistory(lead.id);
      setEdits(edits || []);
    } catch (e) {
      console.error(e);
      setEdits([]);
    } finally {
      setEditsLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (interestFilter !== "all") {
        const v = (l.interested || "").toLowerCase();
        if (interestFilter === "blank" ? v !== "" : v !== interestFilter) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = `${l.lead_name ?? ""} ${l.agent ?? ""} ${l.notes ?? ""} ${l.outcome ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, interestFilter]);

  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(0);
  }, [search, interestFilter]);

  const interestStyle = (v: string | null) => {
    const x = (v || "").toLowerCase();
    if (x === "yes") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (x === "no") return "bg-rose-100 text-rose-700 border-rose-200";
    if (x === "maybe") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <>
      <Card className="border-0 shadow-sm mt-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Leads</CardTitle>
              <Badge variant="secondary">{filtered.length}</Badge>
              <span className="text-xs text-muted-foreground">Click any cell to edit</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={interestFilter} onValueChange={setInterestFilter}>
                <SelectTrigger className="w-[160px] h-9 bg-white">
                  <SelectValue placeholder="All leads" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All leads</SelectItem>
                  <SelectItem value="yes">Interested</SelectItem>
                  <SelectItem value="no">Not interested</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                  <SelectItem value="blank">Unset</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-[220px] bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y bg-[#f9fafb] text-xs uppercase text-muted-foreground">
                  <th className="text-left font-medium px-3 py-3">Agent</th>
                  <th className="text-left font-medium px-3 py-3">Date</th>
                  <th className="text-left font-medium px-3 py-3">Outcome</th>
                  <th className="text-left font-medium px-3 py-3">Lead Name</th>
                  <th className="text-left font-medium px-3 py-3">Last Contact</th>
                  <th className="text-left font-medium px-3 py-3">Interested?</th>
                  <th className="text-left font-medium px-3 py-3">Booked?</th>
                  <th className="text-left font-medium px-3 py-3">TZ</th>
                  <th className="text-left font-medium px-3 py-3 min-w-[260px]">Notes</th>
                  <th className="text-left font-medium px-3 py-3">GHL</th>
                  <th className="text-left font-medium px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                      <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                      Loading leads…
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                      No leads match your filters.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((l) => (
                    <tr key={l.id} className="border-b last:border-0 align-top hover:bg-[#f9fafb]/60">
                      <Cell saving={savingCell === `${l.id}:agent`}>
                        <EditableText value={l.agent} onSave={(v) => saveField(l, "agent", v)} />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:date_contacted`}>
                        <EditableDate value={l.date_contacted} onSave={(v) => saveField(l, "date_contacted", v)} />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:outcome`}>
                        <EditableSelect
                          value={l.outcome}
                          options={OUTCOMES}
                          onSave={(v) => saveField(l, "outcome", v)}
                          renderDisplay={(v) => (
                            <Badge variant="outline" className="bg-slate-100 text-slate-700">
                              {v || "—"}
                            </Badge>
                          )}
                        />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:lead_name`}>
                        <EditableText value={l.lead_name} onSave={(v) => saveField(l, "lead_name", v)} bold />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:last_point_of_contact`}>
                        <EditableText
                          value={l.last_point_of_contact}
                          onSave={(v) => saveField(l, "last_point_of_contact", v)}
                        />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:interested`}>
                        <EditableSelect
                          value={l.interested}
                          options={INTERESTED}
                          onSave={(v) => saveField(l, "interested", v)}
                          renderDisplay={(v) => (
                            <Badge variant="outline" className={interestStyle(v)}>
                              {v || "—"}
                            </Badge>
                          )}
                        />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:appointment_booked`}>
                        <div className="flex items-center">
                          <Checkbox
                            checked={l.appointment_booked}
                            onCheckedChange={(v) => saveField(l, "appointment_booked", !!v)}
                          />
                        </div>
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:time_zone`}>
                        <EditableText value={l.time_zone} onSave={(v) => saveField(l, "time_zone", v)} />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:notes`}>
                        <EditableTextarea value={l.notes} onSave={(v) => saveField(l, "notes", v)} />
                      </Cell>
                      <Cell saving={savingCell === `${l.id}:ghl_link`}>
                        {l.ghl_link ? (
                          <a
                            href={l.ghl_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs font-medium inline-flex items-center gap-1"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <EditableText value={l.ghl_link} onSave={(v) => saveField(l, "ghl_link", v)} />
                        )}
                      </Cell>
                      <td className="px-3 py-2">
                        <Button variant="ghost" size="sm" onClick={() => openHistory(l)} title="View edit history">
                          <History className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-[#f9fafb] text-sm">
              <span className="text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!historyOpen} onOpenChange={(o) => !o && setHistoryOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit History — {historyOpen?.lead_name || "Lead"}
            </DialogTitle>
          </DialogHeader>
          {editsLoading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Loading…</p>
          ) : edits.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No edits recorded yet.</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto space-y-2">
              {edits.map((e) => (
                <div key={e.id} className="border rounded-md p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{e.field}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.edited_at).toLocaleString()}
                      {e.edited_by_label ? ` · ${e.edited_by_label}` : ""}
                    </span>
                  </div>
                  <div className="text-xs grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground">From:</span>{" "}
                      <span className="line-through text-rose-600">{e.old_value || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To:</span>{" "}
                      <span className="text-emerald-700">{e.new_value || "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Cell({ children, saving }: { children: React.ReactNode; saving?: boolean }) {
  return (
    <td className={`px-3 py-2 ${saving ? "bg-blue-50/40" : ""}`}>
      <div className="relative">
        {children}
        {saving && (
          <Loader2 className="w-3 h-3 absolute -right-1 top-1 animate-spin text-blue-500" />
        )}
      </div>
    </td>
  );
}

function EditableText({
  value,
  onSave,
  bold,
}: {
  value: string | null;
  onSave: (v: string) => void;
  bold?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`text-left w-full min-h-[1.5rem] hover:bg-white rounded px-1 -mx-1 ${
          bold ? "font-medium" : "text-muted-foreground"
        }`}
      >
        {value || <span className="text-muted-foreground/50">—</span>}
      </button>
    );
  }
  return (
    <Input
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        setEditing(false);
        onSave(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setV(value ?? "");
          setEditing(false);
        }
      }}
      className="h-7 text-sm"
    />
  );
}

function EditableTextarea({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-left w-full hover:bg-white rounded px-1 -mx-1 text-muted-foreground"
      >
        <span className="line-clamp-3 whitespace-pre-wrap">
          {value || <span className="text-muted-foreground/50">—</span>}
        </span>
      </button>
    );
  }
  return (
    <Textarea
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        setEditing(false);
        onSave(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setV(value ?? "");
          setEditing(false);
        }
      }}
      rows={3}
      className="text-sm"
    />
  );
}

function EditableDate({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (v: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-left w-full hover:bg-white rounded px-1 -mx-1 text-muted-foreground"
      >
        {value ? new Date(value).toLocaleDateString() : <span className="text-muted-foreground/50">—</span>}
      </button>
    );
  }
  return (
    <Input
      type="date"
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        setEditing(false);
        onSave(v || null);
      }}
      className="h-7 text-sm"
    />
  );
}

function EditableSelect({
  value,
  options,
  onSave,
  renderDisplay,
}: {
  value: string | null;
  options: string[];
  onSave: (v: string | null) => void;
  renderDisplay: (v: string | null) => React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-left hover:opacity-80"
      >
        {renderDisplay(value)}
      </button>
    );
  }
  return (
    <Select
      defaultValue={value ?? "__empty__"}
      onValueChange={(v) => {
        setEditing(false);
        onSave(v === "__empty__" ? null : v);
      }}
      open
      onOpenChange={(o) => !o && setEditing(false)}
    >
      <SelectTrigger className="h-7 text-xs w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__empty__">—</SelectItem>
        {options.filter(Boolean).map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
