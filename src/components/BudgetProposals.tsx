import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Calculator } from "lucide-react";
const budgetTiers = [{
  name: "Starter",
  budget: "<$2,000/mo",
  platform: "Meta Platforms",
  features: ["Meta (Facebook + Instagram + Messenger)", "Local targeting (30-mile radius)", "AI platform management", "AI voice callbacks (standard queue)", "Lead Connector CRM integration", "2-3 ad creative variations", "Monthly performance reports", "Monthly strategy sessions", "Expected: 50-70 qualified leads/mo @ $28-40 CPL"],
  recommended: false
}, {
  name: "Growth",
  budget: "$5,000/mo",
  platform: "Multi-Platform",
  features: ["Meta + Google (Search + Pmax) + YouTube", "Extended targeting (50-mile radius)", "AI advanced automation", "AI priority queue + advanced routing", "Lead Connector with automation workflows", "5-7 ad creative variations", "Bi-weekly performance reports", "Bi-weekly optimization calls", "Expected: 120-180 qualified leads/mo @ $28-42 CPL"],
  recommended: true
}, {
  name: "Premium",
  budget: "$10,000/mo +",
  platform: "Full Multi-Channel",
  features: ["Meta, Google Suite, YouTube, LinkedIn, Local Service Ads, Direct Mail", "Multi-region campaign coverage", "AI enterprise features + dedicated support", "AI VIP queue + white-glove service", "Lead Connector advanced automation + custom integrations", "10+ ad creative variations", "Weekly performance reports + custom dashboards", "Weekly strategy sessions + dedicated account manager", "Expected: 300-400 qualified leads/mo @ $25-35 CPL"],
  recommended: false
}];
export const BudgetProposals = () => {
  const [customBudget, setCustomBudget] = useState<string>("");
  const [showCustomResults, setShowCustomResults] = useState(false);
  const calculateCustomBudgetResults = (budget: number) => {
    if (budget < 2000) {
      return {
        tierAlignment: "Below Minimum",
        expectedLeads: {
          min: Math.floor(budget * 0.025),
          max: Math.floor(budget * 0.035)
        },
        cplRange: {
          min: 28,
          max: 40
        },
        platforms: ["Limited coverage - consider Starter tier"],
        recommendation: "We recommend starting with at least $2,000/month for effective campaign management and meaningful results."
      };
    } else if (budget < 3500) {
      return {
        tierAlignment: "Starter Tier",
        expectedLeads: {
          min: 50,
          max: 70
        },
        cplRange: {
          min: 28,
          max: 40
        },
        platforms: ["Meta (Facebook + Instagram + Messenger)"],
        recommendation: "Your budget aligns with our Starter tier - perfect for testing the market with focused Meta campaigns."
      };
    } else if (budget < 5000) {
      const ratio = (budget - 3500) / (5000 - 3500);
      return {
        tierAlignment: "Between Starter & Growth",
        expectedLeads: {
          min: Math.floor(70 + ratio * 50),
          max: Math.floor(90 + ratio * 90)
        },
        cplRange: {
          min: 28,
          max: 42
        },
        platforms: ["Meta Suite", "Partial Google coverage"],
        recommendation: "Consider upgrading to $5,000/month Growth tier for full multi-platform coverage and 120-180 qualified leads/month."
      };
    } else if (budget < 7500) {
      return {
        tierAlignment: "Growth Tier",
        expectedLeads: {
          min: 120,
          max: 180
        },
        cplRange: {
          min: 28,
          max: 42
        },
        platforms: ["Meta", "Google (Search + Pmax)", "YouTube"],
        recommendation: "Your budget aligns perfectly with our Growth tier - optimal balance of reach and profitability."
      };
    } else if (budget < 10000) {
      const ratio = (budget - 7500) / (10000 - 7500);
      return {
        tierAlignment: "Between Growth & Premium",
        expectedLeads: {
          min: Math.floor(180 + ratio * 120),
          max: Math.floor(220 + ratio * 180)
        },
        cplRange: {
          min: 26,
          max: 38
        },
        platforms: ["Meta", "Google Suite", "YouTube", "Partial LinkedIn"],
        recommendation: "Consider upgrading to $10,000/month Premium tier for full multi-channel coverage and dedicated account management."
      };
    } else {
      return {
        tierAlignment: "Premium Tier or Higher",
        expectedLeads: {
          min: 300,
          max: 400
        },
        cplRange: {
          min: 25,
          max: 35
        },
        platforms: ["All platforms activated", "Multi-region coverage"],
        recommendation: "Your budget supports our Premium tier with full multi-channel coverage, dedicated support, and maximum market penetration."
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
  return <section className="py-16 bg-background">
      
    </section>;
};