import { PartnerNavigation } from "@/components/PartnerNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gift, 
  Clock, 
  Trophy, 
  Star, 
  Plane, 
  Laptop, 
  Target,
  Calendar,
  CheckCircle2,
  ShoppingBag,
  ExternalLink
} from "lucide-react";

const activeIncentives = [
  {
    title: "Q1 Sales Sprint",
    description: "Close new service clients this quarter and earn bonus rewards",
    deadline: "March 31, 2024",
    daysLeft: 45,
    prizes: [
      { tier: "Bronze", requirement: "5 clients", reward: "$500 Bonus" },
      { tier: "Silver", requirement: "10 clients", reward: "$1,500 Bonus" },
      { tier: "Gold", requirement: "15+ clients", reward: "$3,000 Bonus + iPad" },
    ],
    status: "active"
  },
  {
    title: "Team Builder Challenge",
    description: "Recruit and activate new partners to unlock exclusive rewards",
    deadline: "February 28, 2024",
    daysLeft: 12,
    prizes: [
      { tier: "3 Partners", requirement: "3 active partners", reward: "$250 Bonus" },
      { tier: "5 Partners", requirement: "5 active partners", reward: "$750 Bonus + Swag" },
      { tier: "10 Partners", requirement: "10 active partners", reward: "$2,000 + Retreat Invite" },
    ],
    status: "active"
  },
];

const upcomingIncentives = [
  {
    title: "Summer Revenue Race",
    description: "Top earners compete for an all-expenses-paid trip",
    startDate: "June 1, 2024",
    prize: "Trip to Mexico + $5,000 spending cash",
    icon: Plane,
  },
  {
    title: "Module Madness",
    description: "Sell the most business modules and win",
    startDate: "April 1, 2024",
    prize: "MacBook Pro + $2,500 bonus",
    icon: Laptop,
  },
];

const monthlyRecognition = [
  { title: "Partner of the Month", prize: "$500 Bonus + Featured Spotlight", icon: Star },
  { title: "Rising Star", prize: "$250 Bonus + Coaching Session", icon: Trophy },
  { title: "Team Builder", prize: "$300 Bonus + Swag Pack", icon: Target },
];

const pastWinners = [
  { name: "Marcus T.", award: "Q4 Sales Champion", prize: "Trip to Vegas + $3,000" },
  { name: "Sarah M.", award: "Partner of the Year 2023", prize: "$10,000 + Conference VIP" },
  { name: "David K.", award: "Fastest to Maverick", prize: "$1,500 + Equipment Upgrade" },
];

export default function PrizesIncentives() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <PartnerNavigation />
      
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">
              <Gift className="w-4 h-4" />
              Prizes & Incentives
            </div>
            <h1 className="text-headline mb-4">Earn Beyond Commissions</h1>
            <p className="text-lg text-muted-foreground">
              Compete in challenges, hit milestones, and win exclusive prizes on top of your regular earnings
            </p>
          </div>
        </div>
      </section>

      {/* Active Incentives */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-section-title">Active Incentives</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {activeIncentives.map((incentive) => (
              <Card key={incentive.title} className="card-hover overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-cyan" />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{incentive.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{incentive.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Ends: {incentive.deadline}</span>
                    <Badge variant="outline" className="ml-auto">
                      {incentive.daysLeft} days left
                    </Badge>
                  </div>

                  {/* Prize Tiers */}
                  <div className="space-y-3">
                    {incentive.prizes.map((prize) => (
                      <div key={prize.tier} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{prize.tier}</p>
                          <p className="text-xs text-muted-foreground">{prize.requirement}</p>
                        </div>
                        <Badge className="bg-accent/10 text-accent border-accent/20">{prize.reward}</Badge>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Recognition */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-section-title mb-8">Monthly Recognition Awards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {monthlyRecognition.map((award) => (
              <Card key={award.title} className="card-hover text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <award.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold mb-2">{award.title}</h3>
                  <p className="text-sm text-muted-foreground">{award.prize}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Swag Store CTA */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">Partner Swag Store</h2>
                  <p className="text-muted-foreground mb-4">
                    Rep the brand with exclusive GFunnel merchandise. Order apparel, accessories, and more to show your partner pride.
                  </p>
                  <Button className="btn-payout" asChild>
                    <a 
                      href="https://swag.gfunnel.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit Swag Store
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center gap-2 mb-8">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-section-title">Coming Soon</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingIncentives.map((incentive) => (
              <Card key={incentive.title} className="border-dashed">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="icon-container-lg">
                    <incentive.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{incentive.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{incentive.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Starts: {incentive.startDate}</span>
                      <Badge variant="outline">{incentive.prize}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Winners */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-section-title mb-8">Hall of Fame</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pastWinners.map((winner) => (
              <Card key={winner.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="font-bold">{winner.name}</span>
                  </div>
                  <p className="text-sm font-medium text-accent mb-1">{winner.award}</p>
                  <p className="text-sm text-muted-foreground">{winner.prize}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
