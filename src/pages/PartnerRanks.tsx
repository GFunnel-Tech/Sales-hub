import { PartnerNavigation } from "@/components/PartnerNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Users, Gift, TrendingUp } from "lucide-react";

const ranks = [
  {
    name: "Explorer",
    emoji: "🌱",
    tagline: "Your journey begins",
    commission: "$1K-$5K/month",
    referrals: "5-20 active",
    color: "from-green-500/10 to-green-600/10",
    borderColor: "border-green-500/30",
    benefits: [
      "Access to training materials",
      "Partner dashboard & tools",
    ]
  },
  {
    name: "Nomad",
    emoji: "✈️",
    tagline: "Living the laptop lifestyle",
    commission: "$5K-$15K/month",
    referrals: "20-50 active",
    color: "from-blue-500/10 to-blue-600/10",
    borderColor: "border-blue-500/30",
    benefits: [
      "Priority support access",
      "Nomad badge & certificate",
    ]
  },
  {
    name: "Maverick",
    emoji: "⚡",
    tagline: "Building serious freedom",
    commission: "$15K-$25K/month",
    referrals: "50-100 active",
    color: "from-purple-500/10 to-purple-600/10",
    borderColor: "border-purple-500/30",
    benefits: [
      "Dedicated success coach",
      "Featured in case studies",
    ]
  },
  {
    name: "Pioneer",
    emoji: "🌍",
    tagline: "Elite earner status",
    commission: "$25K-$50K/month",
    referrals: "100-200 active",
    color: "from-orange-500/10 to-orange-600/10",
    borderColor: "border-orange-500/30",
    benefits: [
      "Exclusive retreat invites",
      "Custom marketing support",
    ]
  },
  {
    name: "Titan",
    emoji: "👑",
    tagline: "Top 1% achiever",
    commission: "$50K-$100K/month",
    referrals: "200+ active",
    color: "from-yellow-500/10 to-amber-500/10",
    borderColor: "border-yellow-500/30",
    benefits: [
      "VIP events & masterminds",
      "Profit-sharing bonuses",
      "Fast-track to Legend equity",
    ]
  },
  {
    name: "Legend",
    emoji: "💎",
    tagline: "Hall of fame level",
    commission: "$100K+/month",
    referrals: "$1M+ total commissions",
    color: "from-pink-500/10 to-purple-500/10",
    borderColor: "border-pink-500/30",
    isLegend: true,
    benefits: [
      "Partner Advisory Board seat",
      "Equity compensation opportunities",
      "Permanent recognition & legacy",
    ]
  },
];

export default function PartnerRanks() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <PartnerNavigation />
      
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">
              <Crown className="w-4 h-4" />
              Achievement System
            </div>
            <h1 className="text-headline mb-4">Unlock Exclusive Partner Ranks</h1>
            <p className="text-lg text-muted-foreground">
              Earn recognition, rewards, and elite status as you build your empire
            </p>
          </div>
        </div>
      </section>

      {/* Ranks Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranks.map((rank, index) => (
              <Card 
                key={rank.name} 
                className={`overflow-hidden card-hover ${rank.borderColor} bg-gradient-to-br ${rank.color}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-4xl mb-2 block">{rank.emoji}</span>
                      <h3 className="text-xl font-bold">{rank.name}</h3>
                      <p className="text-sm text-muted-foreground">{rank.tagline}</p>
                    </div>
                    {rank.isLegend && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                        Ultimate
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm">
                        <span className="font-semibold">{rank.commission}</span> in commissions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-sm">
                        <span className="font-semibold">{rank.referrals}</span> referrals
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Benefits Unlocked
                    </p>
                    <ul className="space-y-2">
                      {rank.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
          <Star className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Start Your Climb to Legend</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every Legend started as an Explorer. The only difference is they took action and never stopped building.
          </p>
        </div>
      </section>

    </div>
  );
}
