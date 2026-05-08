import { Link } from "react-router-dom";
import { PartnerNavigation } from "@/components/PartnerNavigation";
import { HeroBannerCarousel } from "@/components/HeroBannerCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ArrowRight,
  Trophy,
  Calculator,
  BookOpen,
  Crown,
  Gift,
  ExternalLink
} from "lucide-react";

const dashboardItems = [
  { 
    title: "Commissions", 
    description: "View commission rates for software, services, and modules",
    href: "/commissions",
    icon: DollarSign,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600"
  },
  { 
    title: "Partner Ranks", 
    description: "Explore ranks from Explorer to Legend",
    href: "/ranks",
    icon: Crown,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-600"
  },
  { 
    title: "Income Calculator", 
    description: "Project your earnings potential",
    href: "/calculator",
    icon: Calculator,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600"
  },
  { 
    title: "Learning Resources", 
    description: "Access training materials and guides",
    href: "/learning",
    icon: BookOpen,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600"
  },
  { 
    title: "Leaderboard", 
    description: "See top performing partners",
    href: "/leaderboard",
    icon: Trophy,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600"
  },
  { 
    title: "Prizes & Incentives", 
    description: "Current promotions and rewards",
    href: "/incentives",
    icon: Gift,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-600"
  },
];

export default function PartnerHome() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <PartnerNavigation />
      
      {/* Dashboard Content */}
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Hero Banner Carousel */}
        <div className="mb-8">
          <HeroBannerCarousel />
        </div>

        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Partner Hub</h1>
          <p className="text-muted-foreground">Access your resources and tools</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dashboardItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-accent/50 group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.iconBg}`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Payouts Banner */}
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
              <Button className="btn-payout text-white shrink-0" asChild>
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
