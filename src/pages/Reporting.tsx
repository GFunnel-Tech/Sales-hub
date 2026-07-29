import { useEffect, useMemo, useState } from "react";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  useReportingDays, useAccountHealth, useSetterDaily, useOpenAlerts,
  type AccountHealthRow,
} from "@/hooks/useReporting";
import {
  AlertTriangle, CheckCircle2, PhoneOff, Users, CalendarX, Activity, Bell,
} from "lucide-react";
import { toast } from "sonner";

const STATUS: Record<AccountHealthRow["status"], { label: string; cls: string; icon: any }> = {
  complete: { label: "Completed", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  leads_not_worked: { label: "Not worked", cls: "bg-rose-100 text-rose-700 border-rose-200", icon: PhoneOff },
  no_leads_delivered: { label: "No leads delivered", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: Users },
  worked_no_appointments: { label: "Worked · 0 appts", cls: "bg-blue-100 text-blue-700 border-blue-200", icon: CalendarX },
};
const SEV: Record<string, string> = {
  critical: "bg-rose-100 text-rose-700 border-rose-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  info: "bg-slate-100 text-slate-600 border-slate-200",
};
const pct = (n: number | null) => (n == null ? "—" : `${Math.round(n * 100)}%`);

export default function Reporting() {
  const { data: days } = useReportingDays();
  const [day, setDay] = useState<string>();
  useEffect(() => { if (days?.length && !day) setDay(days[0]); }, [days, day]);

  const health = useAccountHealth(day);
  const setters = useSetterDaily(day);
  const alerts = useOpenAlerts();

  const summary = useMemo(() => {
    const rows = health.data ?? [];
    const complete = rows.filter((r) => r.complete).length;
    const notWorked = rows.filter((r) => r.status === "leads_not_worked").length;
    return { total: rows.length, complete, notWorked };
  }, [health.data]);

  const resolveAlert = async (id: string) => {
    const { error } = await (supabase as any).from("account_alerts").update({ resolved: true }).eq("id", id);
    if (error) return toast.error("Could not resolve (admin only)");
    toast.success("Alert resolved");
    alerts.refetch();
  };

  const hasData = (days?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <SalesHubNavigation />
      <main className="container mx-auto px-4 py-6 md:px-8 lg:px-12">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/80 bg-card px-5 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Reporting</p>
            <h1 className="text-3xl font-semibold tracking-tight">Account &amp; Setter Health</h1>
            <p className="text-sm text-muted-foreground">Automated from CRM call activity — no spreadsheet entry.</p>
          </div>
          {hasData && (
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="h-11 w-full md:w-[200px]"><SelectValue placeholder="Select day" /></SelectTrigger>
              <SelectContent>
                {days!.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {!hasData && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Activity className="mx-auto mb-3 h-8 w-8 opacity-40" />
              No reporting data yet. Run a sync (<code>ghl-sync</code>) or ingest a call export
              (<code>ingest-call-export</code>) to populate the fact tables. See <code>docs/PHASE_B.md</code>.
            </CardContent>
          </Card>
        )}

        {hasData && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Tile label="Accounts completed" value={`${summary.complete}/${summary.total}`} icon={CheckCircle2} tint="bg-emerald-50 text-emerald-600" />
              <Tile label="Not completed" value={summary.notWorked} icon={PhoneOff} tint="bg-rose-50 text-rose-600" />
              <Tile label="Open notifications" value={(alerts.data ?? []).length} icon={Bell} tint="bg-amber-50 text-amber-600" />
              <Tile label="Reporting day" value={day ?? "—"} icon={Activity} tint="bg-violet-50 text-violet-600" />
            </div>

            <Tabs defaultValue="health">
              <TabsList>
                <TabsTrigger value="health">Account completion</TabsTrigger>
                <TabsTrigger value="setters">Setter daily</TabsTrigger>
                <TabsTrigger value="alerts">Notifications {(alerts.data?.length ?? 0) > 0 && <Badge className="ml-2" variant="secondary">{alerts.data!.length}</Badge>}</TabsTrigger>
              </TabsList>

              {/* Account completion */}
              <TabsContent value="health">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y bg-[#f9fafb] text-xs uppercase text-muted-foreground">
                          <th className="px-3 py-3 text-left">Account</th>
                          <th className="px-3 py-3 text-left">Status</th>
                          <th className="px-3 py-3 text-right">Worked / Delivered</th>
                          <th className="px-3 py-3 text-right">Completion</th>
                          <th className="px-3 py-3 text-right">Dials</th>
                          <th className="px-3 py-3 text-right">Appts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(health.data ?? []).map((r) => {
                          const s = STATUS[r.status]; const Icon = s.icon;
                          return (
                            <tr key={r.account_id} className="border-b last:border-0 hover:bg-[#f9fafb]/60">
                              <td className="px-3 py-2 font-medium">{r.client_name ?? "—"}</td>
                              <td className="px-3 py-2">
                                <Badge variant="outline" className={s.cls}><Icon className="mr-1 h-3 w-3" />{s.label}</Badge>
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums">{r.contacts_dialed}/{r.delivered_leads}</td>
                              <td className="px-3 py-2 text-right tabular-nums">{pct(r.completion_rate)}</td>
                              <td className="px-3 py-2 text-right tabular-nums">{r.dials}</td>
                              <td className="px-3 py-2 text-right tabular-nums">{r.appointments_set}</td>
                            </tr>
                          );
                        })}
                        {(health.data ?? []).length === 0 && (
                          <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No accounts for this day.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Setter daily */}
              <TabsContent value="setters">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y bg-[#f9fafb] text-xs uppercase text-muted-foreground">
                          <th className="px-3 py-3 text-left">Setter</th>
                          <th className="px-3 py-3 text-left">Account</th>
                          <th className="px-3 py-3 text-right">Dials</th>
                          <th className="px-3 py-3 text-right">Connects</th>
                          <th className="px-3 py-3 text-right">Conversations</th>
                          <th className="px-3 py-3 text-right">Contact rate</th>
                          <th className="px-3 py-3 text-right">Working set</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(setters.data ?? []).map((r, i) => (
                          <tr key={`${r.account_id}-${r.setter_id}-${i}`} className="border-b last:border-0 hover:bg-[#f9fafb]/60">
                            <td className="px-3 py-2 font-medium">{r.setter_name ?? "Unassigned"}</td>
                            <td className="px-3 py-2">{r.client_name ?? "—"}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{r.dials}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{r.connects}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{r.conversations}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{pct(r.contact_rate)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{r.working_set}</td>
                          </tr>
                        ))}
                        {(setters.data ?? []).length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No setter activity for this day.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="alerts">
                <div className="space-y-2">
                  {(alerts.data ?? []).map((a) => (
                    <Card key={a.id} className="border-0 shadow-sm">
                      <CardContent className="flex items-center justify-between gap-4 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                          <div>
                            <p className="text-sm font-medium">{a.message}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="outline" className={SEV[a.severity]}>{a.severity}</Badge>
                              {a.owner && <Badge variant="outline" className="bg-slate-100 text-slate-600">owner: {a.owner}</Badge>}
                              <span className="text-xs text-muted-foreground">{a.day}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => resolveAlert(a.id)}>Resolve</Button>
                      </CardContent>
                    </Card>
                  ))}
                  {(alerts.data ?? []).length === 0 && (
                    <Card className="border-dashed"><CardContent className="py-10 text-center text-muted-foreground">No open notifications. All accounts on track.</CardContent></Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

function Tile({ label, value, icon: Icon, tint }: { label: string; value: React.ReactNode; icon: any; tint: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={`rounded-lg p-2 ${tint}`}><Icon className="h-4 w-4" /></div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
