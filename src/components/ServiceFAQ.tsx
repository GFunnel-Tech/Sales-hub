import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FAQItem } from "@/lib/serviceFAQs";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { BusinessMetrics } from "@/lib/schemas";
import { Check } from "lucide-react";

interface ServiceFAQProps {
  faqs: FAQItem[];
}

export const ServiceFAQ = ({ faqs }: ServiceFAQProps) => {
  const [customBudget, setCustomBudget] = useState<string>("");
  const [showCustomResults, setShowCustomResults] = useState(false);

  // Default business metrics for calculator (security industry averages)
  const defaultMetrics: BusinessMetrics = {
    contractValue: 1500,
    monthlyRecurring: 65,
    serviceDeliveryCosts: 400,
    monthlyServiceCosts: 35,
    retentionMonths: 24,
    closeRate: 5,
    estimatedCPL: 50
  };

  const calculateCustomBudgetResults = (budget: number) => {
    // Find which tier this budget aligns with
    const tier = budgetTiers.find(t => {
      if (budget < 3000) return false;
      if (budget >= 3000 && budget < 5000) return t.budget === 3000;
      if (budget >= 5000 && budget < 8000) return t.budget === 5000;
      return t.budget === 8000;
    }) || budgetTiers[0];

    // Calculate metrics using actual calculator
    const calculations = calculateTierMetrics(tier, defaultMetrics);
    
    let tierAlignment = "";
    let recommendation = "";

    if (budget < 3000) {
      tierAlignment = "Below Minimum Budget";
      recommendation = "We recommend starting at $3,000/mo for optimal results with our AI-powered system. Lower budgets may not generate sufficient lead volume for meaningful ROI.";
    } else if (budget >= 3000 && budget < 5000) {
      tierAlignment = "Starter Tier";
      recommendation = "Good starting point for testing the market. Consider Growth tier ($5,000) for multi-platform reach and better cost per lead.";
    } else if (budget >= 5000 && budget < 8000) {
      tierAlignment = "Growth Tier (Recommended)";
      recommendation = "Ideal budget for most businesses. Multi-platform coverage with strong ROI potential and competitive cost per lead.";
    } else {
      tierAlignment = "Premium Tier";
      recommendation = "Enterprise-level reach. Maximum lead volume with lowest CPL, highest profitability, and dedicated support.";
    }

    return { 
      tierAlignment, 
      recommendation,
      calculations,
      tier
    };
  };

  const handleCalculateCustomBudget = () => {
    const budget = parseFloat(customBudget);
    if (!isNaN(budget) && budget > 0) {
      setShowCustomResults(true);
    }
  };

  const customResults = customBudget && !isNaN(parseFloat(customBudget)) && parseFloat(customBudget) > 0
    ? calculateCustomBudgetResults(parseFloat(customBudget))
    : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          Frequently Asked Questions
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Everything You Need to Know
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((item) => {
          const Icon = item.icon;
          
          // Handle the calculator item dynamically
          if (item.content === null && item.title === "Custom Budget Calculator") {
            return (
              <AccordionItem
                key={item.number}
                value={`item-${item.number}`}
                className="border border-border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="font-semibold text-foreground">
                      {item.title}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 pl-14">
                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Enter your monthly advertising budget below to see what tier you'd fall into and estimated results.
                    </p>

                    <Card className="p-6 bg-muted/30">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Monthly Advertising Budget
                          </label>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                placeholder="5000"
                                value={customBudget}
                                onChange={(e) => setCustomBudget(e.target.value)}
                                className="pl-7"
                              />
                            </div>
                            <Button onClick={handleCalculateCustomBudget} className="shrink-0">
                              Calculate
                            </Button>
                          </div>
                        </div>

                        {showCustomResults && customResults && (
                          <div className="space-y-4 pt-4 border-t border-border">
                            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                              <div className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">Budget Tier</h4>
                                  <p className="text-sm text-muted-foreground">{customResults.tierAlignment}</p>
                                  <p className="text-xs text-muted-foreground mt-2">{customResults.recommendation}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">Monthly Leads</div>
                                <div className="text-2xl font-bold text-primary">{formatNumber(customResults.calculations.expectedLeadsAvg, 0)}</div>
                                <div className="text-xs text-muted-foreground mt-1">@ {formatCurrency(customResults.calculations.cplAvg)} CPL</div>
                              </div>
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">New Customers/Mo</div>
                                <div className="text-2xl font-bold text-secondary">{formatNumber(customResults.calculations.expectedCustomers, 1)}</div>
                                <div className="text-xs text-muted-foreground mt-1">{defaultMetrics.closeRate}% close rate</div>
                              </div>
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">Platforms</div>
                                <div className="text-sm font-bold text-foreground mt-2">{customResults.tier.platforms}</div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-6 border border-secondary/20">
                              <h4 className="font-bold text-foreground mb-4 text-lg">Monthly Financial Projections</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Monthly Revenue Potential</div>
                                  <div className="text-3xl font-bold text-secondary">
                                    {formatCurrency(customResults.calculations.expectedCustomers * (defaultMetrics.contractValue + defaultMetrics.monthlyRecurring))}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">From {formatNumber(customResults.calculations.expectedCustomers, 1)} new customers</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Monthly Gross Profit</div>
                                  <div className="text-3xl font-bold text-primary">{formatCurrency(customResults.calculations.monthlyGrossProfitPotential)}</div>
                                  <div className="text-xs text-muted-foreground mt-1">After service costs</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Monthly ROI</div>
                                  <div className="text-2xl font-bold text-foreground">{formatNumber(customResults.calculations.roi, 0)}%</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {formatCurrency(customResults.calculations.monthlyGrossProfitPotential)} profit on {formatCurrency(parseFloat(customBudget))} spend
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">LTGP:CAC Ratio</div>
                                  <div className="text-2xl font-bold text-accent">{formatNumber(customResults.calculations.ltgpCacRatio, 1)}:1</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {customResults.calculations.ltgpCacRatio >= 3 ? 'Excellent' : customResults.calculations.ltgpCacRatio >= 2 ? 'Good' : 'Below target'} health score
                                  </div>
                                </div>
                              </div>
                            </div>

                             <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                              <h4 className="font-semibold text-foreground text-sm">Investment Breakdown:</h4>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>
                                    <strong className="text-foreground">Ad Spend:</strong> {formatCurrency(parseFloat(customBudget))}/month on platforms
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>
                                    <strong className="text-foreground">Management Fee:</strong> {customResults.tierAlignment === "Starter Tier" ? "<$2,000/month" : formatCurrency(Math.round(parseFloat(customBudget) * 0.10)) + "/month (Business Plan + 10% of ad spend)"}
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>
                                    <strong className="text-foreground">{formatCurrency(customResults.calculations.ltv)} lifetime value</strong> per customer 
                                    ({formatCurrency(defaultMetrics.contractValue)} install + {formatCurrency(defaultMetrics.monthlyRecurring)}/mo × {defaultMetrics.retentionMonths} months)
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>
                                    <strong className="text-foreground">{formatCurrency(customResults.calculations.cac)} customer acquisition cost</strong> including all platform fees and management
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>
                                    <strong className="text-foreground">{formatCurrency(customResults.calculations.netProfitPerCustomer)} net profit per customer</strong> after all costs over customer lifetime
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>24/7 AI-powered lead response with &lt;5 minute response time (voice + SMS)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  <span>Full campaign management, optimization, and monthly strategy calls</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          // Regular FAQ items
          return (
            <AccordionItem
              key={item.number}
              value={`item-${item.number}`}
              className="border border-border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold text-foreground">
                    {item.title}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 pl-14">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};