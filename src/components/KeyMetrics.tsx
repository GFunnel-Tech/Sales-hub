import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Phone, Clock, Award } from "lucide-react";
const metrics = [{
  icon: Users,
  label: "Expected Monthly Leads",
  value: "120-180",
  subtext: "Based on $5,000/mo budget",
  trend: "+25% month over month"
}, {
  icon: DollarSign,
  label: "Cost Per Lead",
  value: "$28-42",
  subtext: "Industry avg: $50-75",
  trend: "44% below average"
}, {
  icon: Phone,
  label: "Lead Response Time",
  value: "< 5 min",
  subtext: "AI-powered callbacks",
  trend: "9x higher conversion"
}, {
  icon: Clock,
  label: "Campaign Setup",
  value: "7-10 days",
  subtext: "From approval to launch",
  trend: "Full optimization by week 3"
}, {
  icon: TrendingUp,
  label: "Expected Conversion Rate",
  value: "4-7%",
  subtext: "Lead to customer",
  trend: "With AI follow-up system"
}, {
  icon: Award,
  label: "Return on Ad Spend",
  value: "3-5x",
  subtext: "Conservative estimate",
  trend: "After 90-day optimization"
}];
export const KeyMetrics = () => {
  return <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          
          
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <metric.icon className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">{metric.label}</h3>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
              <p className="text-sm text-muted-foreground mb-2">{metric.subtext}</p>
              <p className="text-xs text-secondary font-medium">{metric.trend}</p>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 max-w-5xl mx-auto bg-card rounded-lg p-8 shadow-lg border border-border">
          <h3 className="text-2xl font-bold mb-6 text-center text-foreground">90-Day Success Roadmap</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                30
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Days 1-30</h4>
              <p className="text-sm text-muted-foreground">Campaign launch, initial testing, audience refinement</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 text-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                60
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Days 31-60</h4>
              <p className="text-sm text-muted-foreground">Optimization, scale winning ads, expand reach</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                90
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Days 61-90</h4>
              <p className="text-sm text-muted-foreground">Peak performance, predictable lead flow, scaling decisions</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};