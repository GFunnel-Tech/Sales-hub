import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, TrendingUp, Clock, Package, Award, Calculator, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BusinessMetricsForm } from "./BusinessMetricsForm";
import { CalculatorResults } from "./CalculatorResults";
import { BusinessMetrics } from "@/lib/schemas";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

const faqItems = [
  {
    number: 1,
    icon: CheckCircle,
    title: "Why Should I Care?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Traditional advertising agencies charge premium fees with slow response times, resulting in lost leads and wasted budget. Our AI-powered platform combines enterprise-level campaign management with instant lead response—all at a fraction of the cost.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Key Problems We Solve:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Slow lead response times (industry average: 42 hours → we do 5 minutes)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>High cost per lead (Industry avg: $75-150 → Our target: $35-65)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Lost leads during off-hours (24/7 AI coverage)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Inconsistent campaign performance (AI optimization)</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: TrendingUp,
    title: "What's My ROI Potential?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Calculate your exact profitability using our ROI Calculator below. Based on security industry benchmarks and AI-enhanced conversion rates.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">3-5x</div>
            <div className="text-sm text-muted-foreground">Conservative ROAS</div>
            <p className="text-xs text-muted-foreground mt-2">After 90-day optimization period</p>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">$35-65</div>
            <div className="text-sm text-muted-foreground">Target CPL Range</div>
            <p className="text-xs text-muted-foreground mt-2">Competitive with AI optimization</p>
          </div>
        </div>
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <h4 className="font-semibold text-foreground mb-2">Example ROI Scenario:</h4>
          <p className="text-sm text-muted-foreground">
            $5,000/mo budget → 75-140 leads → 3-6% conversion → 3-8 customers → Average customer LTV $2,500 → <span className="font-semibold text-accent">$7,500-20,000 revenue</span> (1.5-4x ROI)
          </p>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "How Soon Will I See Results?",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              30
            </div>
            <h4 className="font-semibold mb-2 text-foreground">Days 1-30</h4>
            <p className="text-sm text-muted-foreground">Campaign launch, initial testing, audience refinement. Expect first leads within 48 hours.</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="bg-secondary/10 text-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              60
            </div>
            <h4 className="font-semibold mb-2 text-foreground">Days 31-60</h4>
            <p className="text-sm text-muted-foreground">Optimization phase, scale winning ads, expand reach. CPL typically drops 20-30%.</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              90
            </div>
            <h4 className="font-semibold mb-2 text-foreground">Days 61-90</h4>
            <p className="text-sm text-muted-foreground">Peak performance, predictable lead flow, data-driven scaling decisions.</p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">Quick Wins Timeline:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Day 1-7:</span> Campaign setup, creative approval, launch</li>
            <li><span className="font-medium text-foreground">Day 8-14:</span> First leads, AI learning phase</li>
            <li><span className="font-medium text-foreground">Day 15-30:</span> Consistent lead flow, initial conversions</li>
            <li><span className="font-medium text-foreground">Day 31+:</span> Optimized performance, scaling opportunities</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 5,
    icon: Package,
    title: "What's Included?",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Starter</Badge>
              <span className="text-sm font-medium text-muted-foreground">&lt;$2,000/mo</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Meta Suite (Facebook, Instagram, Messenger, WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>AI lead response within 5 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Basic campaign optimization</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Growth</Badge>
              <span className="text-sm font-medium text-muted-foreground">$2,000-10,000/mo</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Meta + Google Suite + YouTube</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Advanced AI optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Multi-platform remarketing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Weekly performance reports</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Premium</Badge>
              <span className="text-sm font-medium text-muted-foreground">$10,000/mo +</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>All platforms (Meta, Google, YouTube, LinkedIn, TikTok, Local Service Ads, Direct Mail)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Dedicated account strategist</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Custom audience development</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Priority support & optimization</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            All Tiers Include:
          </h4>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>AI campaign management</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>Flows AI voice assistant</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>Lead Connector CRM integration</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>24/7 lead monitoring</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 6,
    icon: Award,
    title: "Proof It Works",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20 text-center">
            <div className="text-4xl font-bold text-primary mb-2">9x</div>
            <div className="text-sm text-muted-foreground">Higher conversion rate with 5-min response vs 1hr+</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">30%</div>
            <div className="text-sm text-muted-foreground">Average CPL reduction after optimization</div>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20 text-center">
            <div className="text-4xl font-bold text-accent mb-2">65%</div>
            <div className="text-sm text-muted-foreground">Lead response improvement with AI</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">Home Security Company - Austin, TX</h4>
                <p className="text-xs text-muted-foreground">3-month campaign, $4,500/mo budget</p>
              </div>
              <Badge variant="outline">Growth Tier</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              "Within 60 days, our cost per lead dropped from $85 to $48. The AI response system caught leads we would have lost to competitors. We're now booking 32% more installations."
            </p>
            <div className="flex gap-4 text-xs">
              <span className="text-secondary font-medium">94 leads/month</span>
              <span className="text-secondary font-medium">$48 CPL</span>
              <span className="text-secondary font-medium">3.8x ROAS</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-secondary">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">Commercial Security Solutions - Dallas, TX</h4>
                <p className="text-xs text-muted-foreground">6-month campaign, $12,000/mo budget</p>
              </div>
              <Badge variant="outline">Premium Tier</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              "The multi-platform approach brought us qualified commercial leads we never accessed before. LinkedIn + Google combo was a game-changer for B2B. Revenue up 127%."
            </p>
            <div className="flex gap-4 text-xs">
              <span className="text-secondary font-medium">62 qualified leads/month</span>
              <span className="text-secondary font-medium">$194 CPL</span>
              <span className="text-secondary font-medium">5.2x ROAS</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-3 text-center">Industry Benchmarks vs Our Results</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80 mb-1">Industry Avg Response Time</div>
              <div className="text-2xl font-bold">42 hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 ring-2 ring-white/40">
              <div className="text-sm opacity-80 mb-1">Our AI Response Time</div>
              <div className="text-2xl font-bold">&lt; 5 minutes</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 6,
    icon: DollarSign,
    title: "Custom Budget Calculator",
    content: null, // This will be handled dynamically in the component
  },
];

export const FAQAccordion = () => {
  const [customBudget, setCustomBudget] = useState<string>("");
  const [showCustomResults, setShowCustomResults] = useState(false);

  const calculateCustomBudgetResults = (budget: number) => {
    if (budget < 2000) {
      return {
        tierAlignment: "Below Minimum",
        expectedLeads: { min: Math.floor(budget * 0.025), max: Math.floor(budget * 0.035) },
        cplRange: { min: 28, max: 40 },
        platforms: ["Limited coverage - consider Starter tier"],
        recommendation: "We recommend starting with at least $2,000/month for effective campaign management and meaningful results."
      };
    } else if (budget < 3500) {
      return {
        tierAlignment: "Starter Tier",
        expectedLeads: { min: 50, max: 70 },
        cplRange: { min: 28, max: 40 },
        platforms: ["Meta (Facebook + Instagram + Messenger)"],
        recommendation: "Your budget aligns with our Starter tier - perfect for testing the market with focused Meta campaigns."
      };
    } else if (budget < 5000) {
      const ratio = (budget - 3500) / (5000 - 3500);
      return {
        tierAlignment: "Between Starter & Growth",
        expectedLeads: { min: Math.floor(70 + ratio * 50), max: Math.floor(90 + ratio * 90) },
        cplRange: { min: 28, max: 42 },
        platforms: ["Meta Suite", "Partial Google coverage"],
        recommendation: "Consider upgrading to $5,000/month Growth tier for full multi-platform coverage and 120-180 qualified leads/month."
      };
    } else if (budget < 7500) {
      return {
        tierAlignment: "Growth Tier",
        expectedLeads: { min: 120, max: 180 },
        cplRange: { min: 28, max: 42 },
        platforms: ["Meta", "Google (Search + Pmax)", "YouTube"],
        recommendation: "Your budget aligns perfectly with our Growth tier - optimal balance of reach and profitability."
      };
    } else if (budget < 10000) {
      const ratio = (budget - 7500) / (10000 - 7500);
      return {
        tierAlignment: "Between Growth & Premium",
        expectedLeads: { min: Math.floor(180 + ratio * 120), max: Math.floor(220 + ratio * 180) },
        cplRange: { min: 26, max: 38 },
        platforms: ["Meta", "Google Suite", "YouTube", "Partial LinkedIn"],
        recommendation: "Consider upgrading to $10,000/month Premium tier for full multi-channel coverage and dedicated account management."
      };
    } else {
      // Scale results for budgets above $10,000
      const baseBudget = 10000;
      const baseLeadsMin = 300;
      const baseLeadsMax = 400;
      const baseCPLMin = 25;
      const baseCPLMax = 35;
      
      // Calculate scaled leads (increases with budget but with diminishing returns)
      const budgetMultiplier = budget / baseBudget;
      const scaledLeadsMin = Math.floor(baseLeadsMin * Math.pow(budgetMultiplier, 0.85));
      const scaledLeadsMax = Math.floor(baseLeadsMax * Math.pow(budgetMultiplier, 0.85));
      
      // CPL improves slightly with higher budgets (economies of scale)
      const cplImprovementFactor = Math.min(0.8, 1 - (budgetMultiplier - 1) * 0.05);
      const scaledCPLMin = Math.round(baseCPLMin * cplImprovementFactor);
      const scaledCPLMax = Math.round(baseCPLMax * cplImprovementFactor);
      
      return {
        tierAlignment: "Premium Tier or Higher",
        expectedLeads: { min: scaledLeadsMin, max: scaledLeadsMax },
        cplRange: { min: scaledCPLMin, max: scaledCPLMax },
        platforms: ["All platforms activated", "Multi-region coverage", "Advanced targeting"],
        recommendation: budget > 15000 
          ? `Your ${budget.toLocaleString()} budget supports enterprise-level campaigns with maximum market penetration, dedicated team, and priority optimization across all channels.`
          : "Your budget supports our Premium tier with full multi-channel coverage, dedicated support, and maximum market penetration."
      };
    }
  };

  const handleCalculateCustomBudget = () => {
    const budget = parseFloat(customBudget);
    if (!isNaN(budget) && budget > 0) {
      setShowCustomResults(true);
    }
  };

  const customResults = showCustomResults && customBudget ? calculateCustomBudgetResults(parseFloat(customBudget)) : null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible defaultValue="item-1" className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index + 1}`}
                className="border border-border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">
                      {item.number}
                    </div>
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-lg font-semibold text-foreground text-left">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 pl-14">
                  {index === 5 ? (
                    // Custom Budget Calculator content
                    <div>
                      <Card className="p-8 border-2 border-primary/20">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                            <Calculator className="w-4 h-4" />
                            <span className="text-sm font-medium">Custom Budget</span>
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-foreground">Your Proposed Budget</h3>
                          <p className="text-sm text-muted-foreground">
                            Enter your monthly advertising budget to see what you can expect
                          </p>
                        </div>

                        <div className="flex gap-3 mb-6">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input 
                              type="number" 
                              placeholder="3500" 
                              value={customBudget} 
                              onChange={(e) => setCustomBudget(e.target.value)} 
                              className="pl-7" 
                              min="0" 
                              step="100" 
                            />
                          </div>
                          <Button onClick={handleCalculateCustomBudget} disabled={!customBudget}>
                            Calculate Coverage
                          </Button>
                        </div>

                        {customResults && (
                          <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h4 className="font-semibold text-lg mb-4 text-foreground">
                              With ${parseFloat(customBudget).toLocaleString()}/month you can expect:
                            </h4>
                            <ul className="space-y-3 mb-4">
                              <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                <span className="text-sm text-foreground">
                                  <strong>{customResults.expectedLeads.min}-{customResults.expectedLeads.max} qualified leads/month</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                <span className="text-sm text-foreground">
                                  ${customResults.cplRange.min}-${customResults.cplRange.max} cost per lead
                                </span>
                              </li>
                              {customResults.platforms.map((platform, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                  <span className="text-sm text-foreground">{platform}</span>
                                </li>
                              ))}
                              <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                <span className="text-sm text-foreground">
                                  Best fit: <strong>{customResults.tierAlignment}</strong>
                                </span>
                              </li>
                            </ul>
                            <div className="pt-4 border-t border-border">
                              <p className="text-sm text-muted-foreground">
                                💡 <strong>Recommendation:</strong> {customResults.recommendation}
                              </p>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  ) : (
                    item.content
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};