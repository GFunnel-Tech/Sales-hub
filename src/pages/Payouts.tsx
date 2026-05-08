import { useEffect, useState } from "react";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useMember } from "@/hooks/useMember";
import { memberApi } from "@/lib/memberApi";
import { Wallet, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface CommissionItem {
  id: string;
  customer_first_name: string;
  customer_last_name: string | null;
  product_service: string;
  sale_amount: number | null;
  created_at: string;
  commission: number;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  paid_at: string | null;
}

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function Payouts() {
  const { member } = useMember();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("salesperson");
  const [rate, setRate] = useState(0);
  const [items, setItems] = useState<CommissionItem[]>([]);
  const [totals, setTotals] = useState({ earned: 0, paid: 0, pending: 0, available: 0 });
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: "", payment_method: "ach", payment_details: "", notes: "" });

  const load = async () => {
    if (!member) return;
    setLoading(true);
    try {
      const [c, p] = await Promise.all([memberApi.getCommissions(), memberApi.listPayouts()]);
      setRole(c.role);
      setRate(c.rate_percent);
      setItems(c.items);
      setTotals(c.totals);
      setPayouts(p.payouts);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [member]);

  const submitRequest = async () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    setSubmitting(true);
    try {
      await memberApi.requestPayout({
        amount: amt,
        payment_method: form.payment_method,
        payment_details: form.payment_details,
        notes: form.notes,
      });
      toast.success("Payout request submitted");
      setOpen(false);
      setForm({ amount: "", payment_method: "ach", payment_details: "", notes: "" });
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" /> Commissions & Payouts
            </h1>
            <p className="text-muted-foreground">
              Earning <span className="capitalize font-semibold text-foreground">{role}</span> rate of{" "}
              <span className="font-semibold text-foreground">{rate}%</span> per closed sale
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={totals.available <= 0}>
                <DollarSign className="w-4 h-4 mr-2" /> Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Available balance: <strong>${totals.available.toFixed(2)}</strong>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Amount (USD)</Label>
                  <Input type="number" min="1" step="0.01" max={totals.available}
                    value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ach">ACH / Direct Deposit</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Details</Label>
                  <Input placeholder="Account / email / address"
                    value={form.payment_details}
                    onChange={(e) => setForm({ ...form, payment_details: e.target.value })} />
                </div>
                <div>
                  <Label>Notes (optional)</Label>
                  <Textarea value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submitRequest} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-green-600">${totals.earned.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">Available</p>
                <Wallet className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">${totals.available.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">Pending</p>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">${totals.pending.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">Paid Out</p>
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">${totals.paid.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Payout history */}
        <Card className="mb-6">
          <CardHeader><CardTitle>Payout Requests</CardTitle></CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No payout requests yet.</p>
            ) : (
              <div className="space-y-2">
                {payouts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border-b last:border-0 py-2">
                    <div>
                      <p className="font-semibold">${Number(p.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()} • {p.payment_method ?? "—"}
                      </p>
                      {p.admin_notes && <p className="text-xs text-muted-foreground italic mt-1">{p.admin_notes}</p>}
                    </div>
                    <Badge className={statusStyle[p.status] ?? ""}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission breakdown */}
        <Card>
          <CardHeader><CardTitle>Commission Breakdown</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm py-4 text-center">Loading…</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No closed sales yet.</p>
            ) : (
              <div className="space-y-2">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border-b last:border-0 py-2">
                    <div>
                      <p className="font-semibold">{s.customer_first_name} {s.customer_last_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.product_service} • {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">${Number(s.sale_amount ?? 0).toFixed(2)}</p>
                      <p className="font-semibold text-green-600">+${s.commission.toFixed(2)}</p>
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
