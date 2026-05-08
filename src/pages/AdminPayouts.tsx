import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Wallet } from "lucide-react";
import { toast } from "sonner";

interface Row {
  id: string;
  profile_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  payment_details: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  profile?: { full_name: string | null; member_id: string | null; audience: string | null };
}

interface Rule {
  id: string;
  role: string;
  rate_percent: number;
  flat_bonus: number;
  is_active: boolean;
}

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminPayouts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: payouts }, { data: profiles }, { data: rs }] = await Promise.all([
      supabase.from("payout_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name, member_id, audience"),
      supabase.from("commission_rules").select("*").order("role"),
    ]);
    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    setRows(((payouts ?? []) as Row[]).map((r) => ({ ...r, profile: profileMap.get(r.profile_id) as Row["profile"] })));
    setRules((rs ?? []) as Rule[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected" | "paid", admin_notes?: string) => {
    const patch: {
      status: typeof status;
      reviewed_at: string;
      admin_notes?: string;
      paid_at?: string;
    } = {
      status,
      reviewed_at: new Date().toISOString(),
    };
    if (admin_notes !== undefined) patch.admin_notes = admin_notes;
    if (status === "paid") patch.paid_at = new Date().toISOString();
    const { error } = await supabase.from("payout_requests").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    load();
  };

  const updateRule = async (id: string, rate_percent: number, flat_bonus: number) => {
    const { error } = await supabase.from("commission_rules")
      .update({ rate_percent, flat_bonus }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Rule updated");
    load();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5" /> Payouts & Commission Rules
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8 space-y-6">
        <Card>
          <CardHeader><CardTitle>Commission Rules (per role)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {rules.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 bg-background">
                  <p className="font-semibold capitalize mb-2">{r.role}</p>
                  <Label className="text-xs">Rate %</Label>
                  <Input type="number" defaultValue={r.rate_percent}
                    onBlur={(e) => updateRule(r.id, parseFloat(e.target.value), r.flat_bonus)} />
                  <Label className="text-xs mt-2 block">Flat Bonus ($)</Label>
                  <Input type="number" defaultValue={r.flat_bonus}
                    onBlur={(e) => updateRule(r.id, r.rate_percent, parseFloat(e.target.value))} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payout Requests</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground py-4 text-center">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No requests yet.</p>
            ) : (
              <div className="space-y-3">
                {rows.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{r.profile?.full_name ?? "Unknown"}</p>
                        <Badge variant="outline" className="font-mono">{r.profile?.member_id}</Badge>
                        {r.profile?.audience && <Badge variant="secondary" className="capitalize">{r.profile.audience}</Badge>}
                      </div>
                      <p className="text-2xl font-bold">${Number(r.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.payment_method} • {r.payment_details ?? "—"} • {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      {r.notes && <p className="text-sm mt-1 italic">"{r.notes}"</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusStyle[r.status]}>{r.status}</Badge>
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "approved")}>Approve</Button>
                          <RejectDialog onConfirm={(notes) => updateStatus(r.id, "rejected", notes)} />
                        </div>
                      )}
                      {r.status === "approved" && (
                        <Button size="sm" onClick={() => updateStatus(r.id, "paid")}>Mark Paid</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function RejectDialog({ onConfirm }: { onConfirm: (notes: string) => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">Reject</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Reject Payout</DialogTitle></DialogHeader>
        <Textarea placeholder="Reason..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(notes); setOpen(false); }}>Confirm Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
