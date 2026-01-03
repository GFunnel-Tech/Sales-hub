import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMember } from "@/hooks/useMember";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  PlusCircle, 
  List,
  Video,
  ExternalLink,
  Phone,
  Calendar,
  TrendingUp,
  Clock
} from "lucide-react";

interface DashboardStats {
  todayCalls: number;
  weekSales: number;
  pendingFollowups: number;
  conversionRate: number;
}

interface FollowUp {
  id: string;
  customer_first_name: string;
  customer_last_name: string | null;
  follow_up_date: string;
  follow_up_notes: string | null;
  product_service: string;
}

export default function Dashboard() {
  const { member } = useMember();
  const [stats, setStats] = useState<DashboardStats>({
    todayCalls: 0,
    weekSales: 0,
    pendingFollowups: 0,
    conversionRate: 0
  });
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchDashboardData();
    }
  }, [member]);

  const fetchDashboardData = async () => {
    if (!member) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get today's calls
      const { count: todayCount } = await supabase
        .from("sales")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", member.id)
        .gte("created_at", today.toISOString());

      // Get week's sales (disposition = sold)
      const { count: weekSalesCount } = await supabase
        .from("sales")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", member.id)
        .eq("disposition", "sold")
        .gte("created_at", weekAgo.toISOString());

      // Get pending followups
      const { data: followupData, count: followupCount } = await supabase
        .from("sales")
        .select("id, customer_first_name, customer_last_name, follow_up_date, follow_up_notes, product_service", { count: "exact" })
        .eq("profile_id", member.id)
        .not("follow_up_date", "is", null)
        .gte("follow_up_date", new Date().toISOString())
        .order("follow_up_date", { ascending: true })
        .limit(5);

      // Calculate conversion rate
      const { count: totalCalls } = await supabase
        .from("sales")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", member.id)
        .gte("created_at", weekAgo.toISOString());

      const conversionRate = totalCalls && weekSalesCount 
        ? Math.round((weekSalesCount / totalCalls) * 100) 
        : 0;

      setStats({
        todayCalls: todayCount || 0,
        weekSales: weekSalesCount || 0,
        pendingFollowups: followupCount || 0,
        conversionRate
      });

      setFollowups(followupData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Start Sales Process",
      description: "Follow the 7-step guided sales methodology",
      href: "/sales-process",
      icon: FileText,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: "Log Sale / Activity",
      description: "Record a new sale or customer interaction",
      href: "/log-sale",
      icon: PlusCircle,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600"
    },
    {
      title: "View My Sales",
      description: "See all your logged sales and activities",
      href: "/my-sales",
      icon: List,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600"
    }
  ];

  const statCards = [
    { label: "Today's Calls", value: stats.todayCalls, icon: Phone, color: "text-blue-600" },
    { label: "Sales This Week", value: stats.weekSales, icon: TrendingUp, color: "text-green-600" },
    { label: "Pending Follow-ups", value: stats.pendingFollowups, icon: Calendar, color: "text-orange-600" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: Clock, color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{member?.full_name ? `, ${member.full_name}` : ""}! Ready to close some deals?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{loading ? "—" : stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-accent/50 group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${action.iconBg}`}>
                      <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Google Meet Card */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-primary-foreground mb-1">
                    Start a Video Meeting
                  </h2>
                  <p className="text-sm text-primary-foreground/80">
                    Launch Google Meet for webinars and live sales calls
                  </p>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90 shrink-0" asChild>
                  <a 
                    href="https://meet.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Open Google Meet
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Follow-ups */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : followups.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming follow-ups scheduled</p>
              ) : (
                <ul className="space-y-3">
                  {followups.map((followup) => (
                    <li key={followup.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div>
                        <p className="font-medium text-sm">
                          {followup.customer_first_name} {followup.customer_last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{followup.product_service}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(followup.follow_up_date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
