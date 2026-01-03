export interface IndustryPreset {
  name: string;
  contractValue: number;
  monthlyRecurring: number;
  serviceDeliveryCosts: number;
  monthlyServiceCosts: number;
  retentionMonths: number;
  closeRate: number;
  estimatedCPL: number;
  description: string;
}

export const industryPresets: Record<string, IndustryPreset> = {
  "custom": {
    name: "Custom (Enter Your Own)",
    contractValue: 0,
    monthlyRecurring: 0,
    serviceDeliveryCosts: 0,
    monthlyServiceCosts: 0,
    retentionMonths: 24,
    closeRate: 20,
    estimatedCPL: 35,
    description: "Enter your custom business metrics"
  },
  "home-security": {
    name: "Home Security",
    contractValue: 2500,
    monthlyRecurring: 55,
    serviceDeliveryCosts: 800,
    monthlyServiceCosts: 20,
    retentionMonths: 30,
    closeRate: 20,
    estimatedCPL: 35,
    description: "Typical residential security system installation"
  },
  "hvac": {
    name: "HVAC (Residential)",
    contractValue: 6000,
    monthlyRecurring: 25,
    serviceDeliveryCosts: 2000,
    monthlyServiceCosts: 50,
    retentionMonths: 60,
    closeRate: 18,
    estimatedCPL: 45,
    description: "HVAC installation with optional maintenance plans"
  },
  "solar": {
    name: "Solar Installation",
    contractValue: 25000,
    monthlyRecurring: 0,
    serviceDeliveryCosts: 8000,
    monthlyServiceCosts: 30,
    retentionMonths: 120,
    closeRate: 12,
    estimatedCPL: 80,
    description: "Residential solar panel installation"
  },
  "pest-control": {
    name: "Pest Control",
    contractValue: 200,
    monthlyRecurring: 65,
    serviceDeliveryCosts: 100,
    monthlyServiceCosts: 25,
    retentionMonths: 24,
    closeRate: 25,
    estimatedCPL: 30,
    description: "Residential pest control services"
  },
  "pool-service": {
    name: "Pool Service",
    contractValue: 500,
    monthlyRecurring: 150,
    serviceDeliveryCosts: 200,
    monthlyServiceCosts: 40,
    retentionMonths: 36,
    closeRate: 22,
    estimatedCPL: 40,
    description: "Weekly pool maintenance and cleaning"
  },
  "lawn-care": {
    name: "Lawn Care",
    contractValue: 150,
    monthlyRecurring: 80,
    serviceDeliveryCosts: 50,
    monthlyServiceCosts: 20,
    retentionMonths: 18,
    closeRate: 28,
    estimatedCPL: 25,
    description: "Regular lawn maintenance services"
  },
  "roofing": {
    name: "Roofing",
    contractValue: 12000,
    monthlyRecurring: 0,
    serviceDeliveryCosts: 4000,
    monthlyServiceCosts: 50,
    retentionMonths: 240,
    closeRate: 15,
    estimatedCPL: 70,
    description: "Residential roof replacement"
  }
};

export interface MetricDefinition {
  title: string;
  description: string;
  formula?: string;
  example?: string;
  benchmark?: string;
}

export const metricDefinitions: Record<string, MetricDefinition> = {
  ltv: {
    title: "LTV (Lifetime Value)",
    description: "The total revenue you expect from a customer over their entire relationship with your company",
    formula: "Contract Value + (Monthly Recurring × Retention Months)",
    example: "$2,000 install + ($50/mo × 24 months) = $3,200 LTV"
  },
  ltgp: {
    title: "LTGP (Lifetime Gross Profit)",
    description: "The actual profit after deducting all service costs - your TRUE profitability per customer",
    formula: "LTV - Total Service Costs",
    example: "$3,200 LTV - $800 service costs = $2,400 LTGP"
  },
  cac: {
    title: "CAC (Customer Acquisition Cost)",
    description: "Total marketing and sales cost to acquire one new customer",
    formula: "(Ad Spend + Platform Fees + AI Fees + CRM Fees) / (Leads × Close Rate)",
    example: "$5,000 / (150 leads × 20%) = $167 CAC"
  },
  ltgpCacRatio: {
    title: "LTGP:CAC Ratio",
    description: "How many dollars of profit you make for every dollar spent acquiring a customer",
    benchmark: "3:1 or higher is excellent, 2-3:1 is acceptable, below 2:1 needs improvement",
    example: "$2,400 LTGP / $167 CAC = 14.4:1 ratio (Excellent!)"
  },
  contractValue: {
    title: "Contract Value",
    description: "The upfront fee for installation, equipment, or initial setup",
    example: "Home security: $1,500-3,000"
  },
  monthlyRecurring: {
    title: "Monthly Recurring Revenue (MRR)",
    description: "The average monthly payment each customer makes for ongoing service",
    example: "Home security: $40-80/month"
  },
  serviceDeliveryCosts: {
    title: "Service Delivery Costs",
    description: "One-time costs to install/setup service (equipment, labor, permits)",
    example: "Installation crew, equipment: $500-1,200"
  },
  monthlyServiceCosts: {
    title: "Monthly Service Costs",
    description: "Ongoing costs to maintain service (monitoring, support, maintenance)",
    example: "Monitoring center, support: $15-30/month"
  },
  retentionMonths: {
    title: "Customer Retention",
    description: "How many months the average customer stays with your company",
    benchmark: "Security: 24-36 months, HVAC: 48+ months"
  },
  closeRate: {
    title: "Close Rate",
    description: "Percentage of qualified leads that become paying customers",
    benchmark: "Home services: 15-30%, High-ticket: 10-20%"
  },
  cpl: {
    title: "CPL (Cost Per Lead)",
    description: "Average cost to generate one qualified lead through advertising",
    benchmark: "Meta: $25-45, Google: $30-60, Local Service Ads: $20-40"
  }
};
