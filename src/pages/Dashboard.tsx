import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SalesHubNavigation as SalesNavigation } from "@/components/SalesHubNavigation";
import { LeadsManager } from "@/components/LeadsManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMember } from "@/hooks/useMember";
import { memberApi } from "@/lib/memberApi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Phone,
  PlusCircle,
  Search,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  Download,
  FileText,
  Users,
} from "lucide-react";

interface DashboardStats {
  todayCalls: number;
  weekSales: number;
  pendingFollowups: number;
  conversionRate: number;
}

interface Sale {
  id: string;
  customer_first_name: string;
  customer_last_name: string | null;
  product_service: string;
  disposition: string;
  call_type: string | null;
  call_duration_minutes: number | null;
  sale_amount: number | null;
  created_at: string;
}

const RANGE_DAYS: Record<string, number> = {
  "7": 7,
  "30": 30,
  "90": 90,
};

const dispositionStyles: Record<string, string> = {
  sold: "bg-emerald-100 text-emerald-700 border-emerald-200",
  callback: "bg-blue-100 text-blue-700 border-blue-200",
  not_interested: "bg-rose-100 text-rose-700 border-rose-200",
  no_answer: "bg-slate-100 text-slate-700 border-slate-200",
  follow_up: "bg-amber-100 text-amber-700 border-amber-200",
};

function dispositionLabel(d: string) {
  return d
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Dashboard() {
  const { member } = useMember();
  const [stats, setStats] = useState<DashboardStats>({
    todayCalls: 0,
    weekSales: 0,
    pendingFollowups: 0,
    conversionRate: 0,
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (member) fetchData();
  }, [member]);

  const fetchData = async () => {
    if (!member) return;
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        memberApi.getStats(),
        memberApi.listSales(),
      ]);
      setStats(statsRes.stats);
      setSales(salesRes.sales || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const days = RANGE_DAYS[range];

  const scopedSales = useMemo(() => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return sales.filter((s) => new Date(s.created_at).getTime() >= cutoff);
  }, [sales, days]);

  const kpis = useMemo(() => {
    const totalCalls = scopedSales.length;
    const sold = scopedSales.filter((s) => s.disposition === "sold");
    const revenue = sold.reduce((sum, s) => sum + (Number(s.sale_amount) || 0), 0);
    const conversion = totalCalls ? Math.round((sold.length / totalCalls) * 100) : 0;
    return { totalCalls, sales: sold.length, revenue, conversion };
  }, [scopedSales]);

  const chartData = useMemo(() => {
    const buckets: Record<string, { date: string; calls: number; sales: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = { date: key.slice(5), calls: 0, sales: 0 };
    }
    scopedSales.forEach((s) => {
      const key = new Date(s.created_at).toISOString().slice(0, 10);
      if (buckets[key]) {
        buckets[key].calls += 1;
        if (s.disposition === "sold") buckets[key].sales += 1;
      }
    });
    return Object.values(buckets);
  }, [scopedSales, days]);

  const breakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedSales.forEach((s) => {
      counts[s.disposition] = (counts[s.disposition] || 0) + 1;
    });
    return counts;
  }, [scopedSales]);

  const filteredLogs = useMemo(() => {
    return scopedSales.filter((s) => {
      if (filter !== "all" && s.disposition !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = `${s.customer_first_name} ${s.customer_last_name ?? ""}`.toLowerCase();
        if (!name.includes(q) && !s.product_service.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [scopedSales, filter, search]);

  const statCards = [
    {
      label: "Total Calls",
      value: kpis.totalCalls,
      sub: `Last ${days} days`,
      icon: Phone,
      tint: "bg-blue-50 text-blue-600",
    },
    {
      label: "Sales Closed",
      value: kpis.sales,
      sub: `Last ${days} days`,
      icon: TrendingUp,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Conversion Rate",
      value: `${kpis.conversion}%`,
      sub: `Last ${days} days`,
      icon: Clock,
      tint: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Revenue",
      value: `$${kpis.revenue.toLocaleString()}`,
      sub: `Last ${days} days`,
      icon: DollarSign,
      tint: "bg-rose-50 text-rose-600",
    },
  ];

  const quickActions = [
    { label: "Refresh data", icon: RefreshCw, onClick: fetchData },
    { label: "Export logs", icon: Download, onClick: () => exportCsv(filteredLogs) },
    { label: "View all sales", icon: FileText, href: "/my-sales" },
    { label: "Log new call", icon: PlusCircle, href: "/log-sale" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />

      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Overview</h1>
            <p className="text-muted-foreground">
              What's happening across your call activity
              {member?.full_name ? `, ${member.full_name.split(" ")[0]}` : ""}.
            </p>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[160px] bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className={`p-2 rounded-lg ${stat.tint}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {loading ? "—" : stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action) =>
                action.href ? (
                  <Link key={action.label} to={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-11 bg-[#f9fafb] hover:bg-white"
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={action.label}
                    variant="outline"
                    onClick={action.onClick}
                    className="w-full justify-start h-11 bg-[#f9fafb] hover:bg-white"
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trend + Breakdown */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Call Activity</CardTitle>
              <p className="text-xs text-muted-foreground">Last {days} days</p>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="callsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke="hsl(217 91% 60%)"
                      strokeWidth={2}
                      fill="url(#callsFill)"
                      name="Calls"
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(160 84% 39%)"
                      strokeWidth={2}
                      fill="url(#salesFill)"
                      name="Sales"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Outcome Breakdown</CardTitle>
              <p className="text-xs text-muted-foreground">
                Status across all calls
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(breakdown).length === 0 ? (
                <p className="text-sm text-muted-foreground">No calls in this range.</p>
              ) : (
                Object.entries(breakdown).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={dispositionStyles[key] || "bg-slate-100 text-slate-700"}
                    >
                      {dispositionLabel(key)}
                    </Badge>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                ))
              )}
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> Total calls
                </span>
                <span className="text-sm font-bold">{kpis.totalCalls}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Logs Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">All Calls</CardTitle>
                <Badge variant="secondary">{filteredLogs.length}</Badge>
                <span className="text-xs text-muted-foreground">Last {days} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[160px] h-9 bg-white">
                    <SelectValue placeholder="All outcomes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All outcomes</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="callback">Callback</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="not_interested">Not Interested</SelectItem>
                    <SelectItem value="no_answer">No Answer</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 w-[200px] bg-white"
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
                    <th className="text-left font-medium px-4 py-3 w-12">#</th>
                    <th className="text-left font-medium px-4 py-3">Customer</th>
                    <th className="text-left font-medium px-4 py-3">Outcome</th>
                    <th className="text-left font-medium px-4 py-3">Product</th>
                    <th className="text-left font-medium px-4 py-3">Duration</th>
                    <th className="text-left font-medium px-4 py-3">Amount</th>
                    <th className="text-left font-medium px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        Loading…
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No calls logged in this range.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((s, idx) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-[#f9fafb]">
                        <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium">
                          {s.customer_first_name} {s.customer_last_name ?? ""}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              dispositionStyles[s.disposition] ||
                              "bg-slate-100 text-slate-700"
                            }
                          >
                            {dispositionLabel(s.disposition)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.product_service}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {s.call_duration_minutes ? `${s.call_duration_minutes}m` : "—"}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {s.sale_amount ? `$${Number(s.sale_amount).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <LeadsManager />
      </main>

    </div>
  );
}

function exportCsv(rows: Sale[]) {
  const headers = ["Customer", "Outcome", "Product", "Duration", "Amount", "Date"];
  const lines = rows.map((s) => [
    `${s.customer_first_name} ${s.customer_last_name ?? ""}`.trim(),
    s.disposition,
    s.product_service,
    s.call_duration_minutes ?? "",
    s.sale_amount ?? "",
    new Date(s.created_at).toISOString(),
  ]);
  const csv = [headers, ...lines]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `call-logs-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


