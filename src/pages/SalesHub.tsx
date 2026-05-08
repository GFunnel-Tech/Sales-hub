import { Link } from "react-router-dom";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { SalesHubBanner } from "@/components/SalesHubBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  PhoneCall,
  ClipboardList,
  FileText,
  BarChart3,
  Target,
  MessageCircle,
  BookOpen
} from "lucide-react";

const hubItems = [
  { 
    title: "Sales Process", 
    description: "Follow the 7-step ACE methodology from handshake to handoff",
    href: "/sales-process",
    icon: Target,
    iconBg: "bg-primary/10",
    iconColor: "text-primary"
  },
  { 
    title: "Objection Playbook", 
    description: "Master the Isolate → Accept → Create → Expand loop",
    href: "/objection-playbook",
    icon: MessageCircle,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600"
  },
  { 
    title: "Log a Sale", 
    description: "Record your calls, demos, and closed deals",
    href: "/log-sale",
    icon: PhoneCall,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600"
  },
  { 
    title: "My Sales", 
    description: "View your sales history and follow-ups",
    href: "/my-sales",
    icon: ClipboardList,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600"
  },
  { 
    title: "Scripts", 
    description: "Access proven sales scripts and templates",
    href: "/scripts",
    icon: FileText,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600"
  },
  { 
    title: "Sales Training", 
    description: "Learn the ACE framework and key principles",
    href: "/sales-training",
    icon: BookOpen,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600"
  },
  { 
    title: "Dashboard", 
    description: "Track your performance metrics and stats",
    href: "/dashboard",
    icon: BarChart3,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600"
  },
];

export default function SalesHub() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesHubNavigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Hero Banner */}
        <div className="mb-8">
          <SalesHubBanner />
        </div>

        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Sales Hub</h1>
          <p className="text-muted-foreground">Your tools for closing deals and tracking success</p>
        </div>

        {/* Hub Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {hubItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.iconBg}`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Banner */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-semibold text-primary-foreground mb-1">
                  Payouts Dashboard
                </h2>
                <p className="text-sm text-primary-foreground/80">
                  View commissions, track your team, and manage payouts
                </p>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 shrink-0" asChild>
                <Link to="/payouts" className="flex items-center gap-2">
                  View Commissions & Payouts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
