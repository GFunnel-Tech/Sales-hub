import { useState } from "react";
import { PartnerNavigation } from "@/components/PartnerNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Wrench, 
  Package, 
  ShoppingBag,
  ArrowRight,
  Check
} from "lucide-react";

interface CommissionTier {
  name: string;
  icon: string;
  direct: string;
  directPercent?: string;
  second?: string;
  third?: string;
  isElite?: boolean;
}

const softwareCommissions: CommissionTier[] = [
  { name: "Office Software", icon: "💼", direct: "30%", second: "10%", isElite: false },
  { name: "Office Elite Software", icon: "⭐", direct: "50%", second: "10%", isElite: true },
  { name: "Business Software", icon: "🏢", direct: "30%", second: "10%", third: "5%", isElite: false },
  { name: "Business Elite Software", icon: "🚀", direct: "50%", second: "10%", third: "5%", isElite: true },
];

const servicesCommissions: CommissionTier[] = [
  { name: "Office Services", icon: "🛠️", direct: "20%", second: "10%", isElite: false },
  { name: "Office Elite Services", icon: "✨", direct: "30%", second: "10%", isElite: true },
  { name: "Business Services", icon: "⚙️", direct: "20%", second: "10%", third: "5%", isElite: false },
  { name: "Business Elite Services", icon: "💎", direct: "30%", second: "10%", third: "5%", isElite: true },
];

const businessModules = [
  {
    type: "Foundation Modules",
    price: "$297",
    examples: "Digital Marketing, Recruiting",
    tiers: [
      { tier: "Standard", direct: "30%", directAmount: "$89", second: null, third: null },
      { tier: "Office", direct: "70%", directAmount: "$208", second: "10% ($30)", third: null },
      { tier: "Office Elite", direct: "70%", directAmount: "$208", second: "10% ($30)", third: null },
      { tier: "Business", direct: "70%", directAmount: "$208", second: "10% ($30)", third: "5% ($15)" },
      { tier: "Business Elite", direct: "70%", directAmount: "$208", second: "10% ($30)", third: "5% ($15)" },
    ]
  },
  {
    type: "Industry Modules",
    price: "$997",
    examples: "Restaurant, Real Estate, Fitness, Home Services",
    tiers: [
      { tier: "Standard", direct: "30%", directAmount: "$299", second: null, third: null },
      { tier: "Office", direct: "70%", directAmount: "$698", second: "10% ($100)", third: null },
      { tier: "Office Elite", direct: "70%", directAmount: "$698", second: "10% ($100)", third: null },
      { tier: "Business", direct: "70%", directAmount: "$698", second: "10% ($100)", third: "5% ($50)" },
      { tier: "Business Elite", direct: "70%", directAmount: "$698", second: "10% ($100)", third: "5% ($50)" },
    ]
  }
];

const marketplaceCommissions = [
  { name: "Marketplace Products", icon: "📦", direct: "10%", second: "5%" },
  { name: "Marketplace Subscriptions (Office)", icon: "🔄", direct: "15%", second: "10%" },
  { name: "Marketplace Subscriptions (Business)", icon: "🔁", direct: "15%", second: "10%", third: "5%" },
];

const moduleIncludes = [
  { icon: "🎯", title: "Done-For-You Setup", description: "Complete business configured and ready to go" },
  { icon: "📚", title: "Complete Course", description: "Step-by-step training to customize and scale" },
  { icon: "⚙️", title: "Software Included", description: "All tools and systems pre-configured" },
  { icon: "👥", title: "Recruiting System", description: "Build and manage your own team" },
];

function CommissionCard({ tier }: { tier: CommissionTier }) {
  return (
    <Card className={`card-hover ${tier.isElite ? 'border-accent/30 bg-accent/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-2xl mb-2 block">{tier.icon}</span>
            <h3 className="font-semibold">{tier.name}</h3>
          </div>
          {tier.isElite && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Elite
            </Badge>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Direct Sales (1st Gen)</span>
            <span className="text-lg font-bold text-success">{tier.direct}</span>
          </div>
          {tier.second && (
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Team Sales (2nd Gen)</span>
              <span className="font-semibold">{tier.second}</span>
            </div>
          )}
          {tier.third && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Network Sales (3rd Gen)</span>
              <span className="font-semibold">{tier.third}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommissionStructure() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <PartnerNavigation />
      
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">Commission Structure</div>
            <h1 className="text-headline mb-4">What You'll Actually Earn</h1>
            <p className="text-lg text-muted-foreground">
              Transparent commission rates across all products—software, services, business modules, and marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Commission Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <Tabs defaultValue="software" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted">
              <TabsTrigger value="software" className="flex items-center gap-2 py-3">
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Software</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2 py-3">
                <Wrench className="w-4 h-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="modules" className="flex items-center gap-2 py-3">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Modules</span>
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2 py-3">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Marketplace</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="software" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {softwareCommissions.map((tier) => (
                  <CommissionCard key={tier.name} tier={tier} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {servicesCommissions.map((tier) => (
                  <CommissionCard key={tier.name} tier={tier} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-8">
              {/* Business In A Box Intro */}
              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🚀</span>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Business In A Box</h3>
                      <p className="text-muted-foreground">
                        One-time purchase gets customers a complete done-for-you business with course, software setup, and systems. 
                        They can either resell our services (and earn commissions) or fulfill services themselves (and keep 100%).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Module Types */}
              {businessModules.map((module) => (
                <div key={module.type}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold">{module.type}</h3>
                    <Badge variant="outline">{module.price} one-time</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{module.examples}</p>
                  <div className="grid md:grid-cols-5 gap-4">
                    {module.tiers.map((tier) => (
                      <Card key={tier.tier} className="card-hover">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">{tier.tier}</h4>
                            {tier.tier !== "Standard" && (
                              <Badge className="bg-accent/10 text-accent border-0 text-xs">
                                Higher Tier
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Direct (1st Gen)</span>
                              <div className="text-right">
                                <span className="text-lg font-bold text-success">{tier.direct}</span>
                                <span className="text-sm text-muted-foreground ml-1">({tier.directAmount})</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Team (2nd Gen)</span>
                              <span className="font-medium">{tier.second || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-muted-foreground">Network (3rd Gen)</span>
                              <span className="font-medium">{tier.third || "—"}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Included in Every Business Module?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {moduleIncludes.map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {marketplaceCommissions.map((item) => (
                  <Card key={item.name} className="card-hover">
                    <CardContent className="p-6">
                      <span className="text-2xl mb-3 block">{item.icon}</span>
                      <h3 className="font-semibold mb-4">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">Direct (1st Gen)</span>
                          <span className="font-bold text-success">{item.direct}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">Team (2nd Gen)</span>
                          <span className="font-medium">{item.second}</span>
                        </div>
                        {item.third && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Network (3rd Gen)</span>
                            <span className="font-medium">{item.third}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

    </div>
  );
}
