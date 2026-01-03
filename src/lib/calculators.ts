import { BusinessMetrics } from "./schemas";

export interface BudgetTier {
  name: string;
  budget: number;
  platforms: string[];
  expectedLeads: { min: number; max: number };
  defaultCPL: { min: number; max: number };
  platformFees: {
    plaiio: number;
    flowsAI: number;
    leadConnector: number;
    creative: number;
    analytics: number;
  };
}

export const budgetTiers: BudgetTier[] = [
  {
    name: "Starter",
    budget: 2000,
    platforms: ["Meta (Facebook + Instagram + Messenger)"],
    expectedLeads: { min: 50, max: 70 },
    defaultCPL: { min: 28, max: 40 },
    platformFees: {
      plaiio: 220, // 11%
      flowsAI: 120, // 6%
      leadConnector: 50, // 2.5%
      creative: 120, // 6%
      analytics: 40 // 2%
    }
  },
  {
    name: "Growth",
    budget: 5000,
    platforms: ["Meta", "Google (Search + Pmax)", "YouTube"],
    expectedLeads: { min: 120, max: 180 },
    defaultCPL: { min: 28, max: 42 },
    platformFees: {
      plaiio: 550, // 11%
      flowsAI: 300, // 6%
      leadConnector: 125, // 2.5%
      creative: 300, // 6%
      analytics: 100 // 2%
    }
  },
  {
    name: "Premium",
    budget: 10000,
    platforms: ["Full Multi-Channel (Meta, Google Suite, YouTube, LinkedIn, Local Service Ads, Direct Mail)"],
    expectedLeads: { min: 300, max: 400 },
    defaultCPL: { min: 25, max: 35 },
    platformFees: {
      plaiio: 1100, // 11%
      flowsAI: 600, // 6%
      leadConnector: 250, // 2.5%
      creative: 600, // 6%
      analytics: 200 // 2%
    }
  }
];

export interface TierCalculations {
  tierName: string;
  budget: number;
  adSpend: number;
  totalPlatformFees: number;
  expectedLeadsAvg: number;
  cplAvg: number;
  expectedCustomers: number;
  cac: number;
  ltv: number;
  totalServiceCosts: number;
  ltgp: number;
  ltgpCacRatio: number;
  netProfitPerCustomer: number;
  roi: number;
  monthlyGrossProfitPotential: number;
  breakEvenMonths: number;
  platforms: string[];
}

export function calculateLTV(contractValue: number, monthlyRecurring: number, retentionMonths: number): number {
  return contractValue + (monthlyRecurring * retentionMonths);
}

export function calculateTotalServiceCosts(
  serviceDeliveryCosts: number,
  monthlyServiceCosts: number,
  retentionMonths: number
): number {
  return serviceDeliveryCosts + (monthlyServiceCosts * retentionMonths);
}

export function calculateLTGP(ltv: number, totalServiceCosts: number): number {
  return ltv - totalServiceCosts;
}

export function calculateCAC(
  budget: number,
  platformFees: BudgetTier['platformFees'],
  expectedLeads: number,
  closeRate: number
): number {
  const totalFees = Object.values(platformFees).reduce((sum, fee) => sum + fee, 0);
  const totalCost = budget; // Budget already includes all fees
  const customers = expectedLeads * (closeRate / 100);
  return customers > 0 ? totalCost / customers : 0;
}

export function calculateTierMetrics(
  tier: BudgetTier,
  metrics: BusinessMetrics
): TierCalculations {
  const ltv = calculateLTV(metrics.contractValue, metrics.monthlyRecurring, metrics.retentionMonths);
  const totalServiceCosts = calculateTotalServiceCosts(
    metrics.serviceDeliveryCosts,
    metrics.monthlyServiceCosts,
    metrics.retentionMonths
  );
  const ltgp = calculateLTGP(ltv, totalServiceCosts);

  const totalPlatformFees = Object.values(tier.platformFees).reduce((sum, fee) => sum + fee, 0);
  const adSpend = tier.budget - totalPlatformFees;

  const expectedLeadsAvg = (tier.expectedLeads.min + tier.expectedLeads.max) / 2;
  const cplAvg = metrics.estimatedCPL || (tier.defaultCPL.min + tier.defaultCPL.max) / 2;
  const closeRateDecimal = metrics.closeRate / 100;
  const expectedCustomers = expectedLeadsAvg * closeRateDecimal;

  const cac = calculateCAC(tier.budget, tier.platformFees, expectedLeadsAvg, metrics.closeRate);
  const netProfitPerCustomer = ltgp - cac;
  const roi = cac > 0 ? ((netProfitPerCustomer) / cac) * 100 : 0;
  const ltgpCacRatio = cac > 0 ? ltgp / cac : 0;
  const monthlyGrossProfitPotential = expectedCustomers * netProfitPerCustomer;
  const breakEvenMonths = metrics.monthlyRecurring > 0 ? cac / metrics.monthlyRecurring : 0;

  return {
    tierName: tier.name,
    budget: tier.budget,
    adSpend,
    totalPlatformFees,
    expectedLeadsAvg,
    cplAvg,
    expectedCustomers,
    cac,
    ltv,
    totalServiceCosts,
    ltgp,
    ltgpCacRatio,
    netProfitPerCustomer,
    roi,
    monthlyGrossProfitPotential,
    breakEvenMonths,
    platforms: tier.platforms
  };
}

export function getRatioColor(ratio: number): "green" | "yellow" | "red" {
  if (ratio >= 3) return "green";
  if (ratio >= 2) return "yellow";
  return "red";
}

export function getRatioLabel(ratio: number): string {
  if (ratio >= 3) return "Excellent";
  if (ratio >= 2) return "Good";
  return "Poor";
}
