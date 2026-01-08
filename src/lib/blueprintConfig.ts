// Blueprint Session Configuration

export const BLUEPRINT_PAGES = [
  { id: 1, name: "Handshake", path: "/blueprint" },
  { id: 2, name: "Dream State", path: "/blueprint/dream-state" },
  { id: 3, name: "Pain Points", path: "/blueprint/pain-points" },
  { id: 4, name: "Bridge", path: "/blueprint/bridge" },
  { id: 5, name: "Qualification", path: "/blueprint/qualification" },
  { id: 6, name: "Discovery", path: "/blueprint/discovery" },
  { id: 7, name: "Presentation", path: "/blueprint/presentation" },
  { id: 8, name: "Pricing", path: "/blueprint/pricing" },
  { id: 9, name: "Completion", path: "/blueprint/completion" },
] as const;

export const DREAM_STATE_QUESTIONS = [
  "If we could build you the perfect system, what would your ideal business look like 12 months from now?",
  "Why is achieving this important to you personally?",
  "What would change in your day-to-day life if you had this system working perfectly?",
];

export const PAIN_POINT_QUESTIONS = [
  "What's the biggest bottleneck or frustration you're facing right now in your business?",
  "How long have you been dealing with this problem, and what has it cost you?",
  "What have you tried before that hasn't worked?",
];

export const QUALIFICATION_QUESTIONS = [
  { id: "budget", question: "Do you have a budget set aside for solving this problem?" },
  { id: "authority", question: "Are you the decision-maker for this investment?" },
  { id: "timeline", question: "Are you looking to implement a solution in the next 30-60 days?" },
  { id: "commitment", question: "Are you willing to commit time to the onboarding and training process?" },
  { id: "urgency", question: "Is solving this problem a top priority for you right now?" },
];

export const INDUSTRY_OPTIONS = [
  "SaaS / Technology",
  "E-commerce / Retail",
  "Professional Services",
  "Healthcare",
  "Real Estate",
  "Finance / Insurance",
  "Marketing / Advertising",
  "Education",
  "Manufacturing",
  "Other",
];

export const PRICING_PLANS = [
  {
    id: "software",
    name: "Software Only",
    price: "$300/mo",
    description: "Full access to GFunnel platform with self-service setup",
    features: [
      "Lead Connector CRM",
      "Flows AI Automation",
      "Website & Funnel Builder",
      "Contract Management",
      "Analytics Dashboard",
    ],
  },
  {
    id: "services",
    name: "Done-For-You Services",
    price: "$300-500/mo + Setup",
    description: "We build and configure everything for you",
    features: [
      "Everything in Software",
      "Custom Funnel Build",
      "Automation Setup",
      "Integration Configuration",
      "30-Day Support",
    ],
    recommended: true,
  },
  {
    id: "support",
    name: "Ongoing Support",
    price: "$300/mo",
    description: "Dedicated support and optimization",
    features: [
      "Priority Support",
      "Monthly Strategy Calls",
      "Continuous Optimization",
      "New Feature Implementation",
      "Performance Reporting",
    ],
  },
];

export const DISPOSITION_OPTIONS = [
  { value: "closed", label: "Closed - Won", color: "text-green-600" },
  { value: "free", label: "Started Free Trial", color: "text-blue-600" },
  { value: "follow_up", label: "Follow-Up Required", color: "text-amber-600" },
  { value: "not_qualified", label: "Not Qualified", color: "text-red-600" },
  { value: "no_show", label: "No Show", color: "text-muted-foreground" },
];
