import { CheckCircle, TrendingUp, Clock, Package, Award, Calculator, DollarSign, Settings, FileText, Zap, Palette, MessageSquare, Presentation, Share2, Video, Sparkles, Bot, Plug, Database, Shield, Target, Users, BarChart } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FAQItem {
  number: number;
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

export const paidAdsFAQs: FAQItem[] = [
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
    title: "How Long Until I See Results?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Campaigns launch within 5-7 business days, with first leads typically arriving within 48 hours of go-live.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Days 1-7: Setup & Launch</h4>
              <p className="text-sm text-muted-foreground">Campaign creation, AI voice training, and platform optimization</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Days 8-30: Initial Data</h4>
              <p className="text-sm text-muted-foreground">First leads arrive, AI begins learning from interactions</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-sm font-bold text-secondary">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Days 31-90: Optimization</h4>
              <p className="text-sm text-muted-foreground">Performance stabilizes, CPL decreases, conversion rates improve</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 4,
    icon: Package,
    title: "What's Included in Each Budget Tier?",
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          We offer three strategic budget tiers designed to scale with your business growth. Each tier includes our full AI-powered lead response system, but varies in campaign reach and expected lead volume.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Starter Tier */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-foreground text-lg">Starter Tier</h4>
                <p className="text-2xl font-bold text-primary mt-1">$3,000/mo</p>
                <p className="text-sm text-muted-foreground mt-1">&lt;$2,000 management fee</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Facebook Ads only</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">45-85 expected leads/month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">AI Voice Response included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Basic campaign optimization</span>
              </div>
            </div>
          </div>

          {/* Growth Tier */}
          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5 relative">
            <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">Most Popular</Badge>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-foreground text-lg">Growth Tier</h4>
                <p className="text-2xl font-bold text-primary mt-1">$5,000/mo</p>
                <p className="text-sm text-muted-foreground mt-1">$500 + 10% management</p>
              </div>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Facebook + Google Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">75-140 expected leads/month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">AI Voice Response + SMS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Advanced AI optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Multi-platform retargeting</span>
              </div>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-foreground text-lg">Premium Tier</h4>
                <p className="text-2xl font-bold text-primary mt-1">$8,000/mo</p>
                <p className="text-sm text-muted-foreground mt-1">$800 + 10% management</p>
              </div>
              <Badge variant="outline">Enterprise</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Facebook + Google + YouTube</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">120-230 expected leads/month</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Full AI suite (Voice + SMS + Email)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Premium optimization + A/B testing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">Dedicated account strategist</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">All tiers include:</span> 24/7 AI lead response, campaign management, monthly reporting, and our proprietary lead optimization system. Platform fees are separate and billed directly by Facebook/Google.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: 5,
    icon: Award,
    title: "What Makes Your Service Different?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We're the only service that combines professional campaign management with instant AI-powered lead response. While agencies charge $2,000-5,000/mo just for management, we include AI voice calling, SMS follow-up, and lead nurturing at no extra cost.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              Traditional Agencies
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground pl-7">
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                <span>Response time: 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                <span>Management fee: $2,000-5,000/mo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                <span>Lead response: Extra $500-2,000/mo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                <span>Limited to business hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                <span>Manual optimization</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3 bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Our AI-Powered Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground pl-7">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Response time: &lt;5 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>All-inclusive pricing (no hidden fees)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>AI lead response included free</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>24/7 automated coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>AI-driven optimization</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            The Bottom Line
          </h4>
          <p className="text-sm text-muted-foreground">
            Traditional agencies: $5,000-10,000/mo total cost with slower results. Our platform: $3,000-8,000/mo all-inclusive with faster response times and better ROI. You save money while getting more leads and higher conversion rates.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: 6,
    icon: Calculator,
    title: "Custom Budget Calculator",
    content: null, // This will be handled dynamically in ServiceFAQ component
  }
];

export const administrativeServicesFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Clock,
    title: "Why Should I Care About Professional Administrative Support?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          As a business owner, your time is your most valuable asset. Yet many entrepreneurs find themselves drowning in administrative tasks that prevent them from focusing on revenue-generating activities. Studies show that small business owners spend up to <strong>68.1% of their time on administrative work</strong> rather than strategic growth initiatives.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Common Administrative Bottlenecks We Solve:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Email management consuming 2-3 hours daily</li>
            <li>• Scheduling conflicts and missed appointments</li>
            <li>• Disorganized documents and poor record keeping</li>
            <li>• Delayed invoicing and payment follow-ups</li>
            <li>• Data entry errors costing time and money</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our professional administrative services free up an average of <strong>15-20 hours per week</strong> for business owners, allowing you to focus on what truly matters: growing your business, serving customers, and developing strategic partnerships.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          With 99.9% accuracy rates and same-day turnaround on most tasks, you'll experience immediate improvements in operational efficiency and peace of mind knowing every detail is handled professionally.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: CheckCircle,
    title: "What Exactly Can Your Administrative Team Handle?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our comprehensive administrative support covers virtually every operational task that keeps your business running smoothly. We serve as your extended team, handling both routine and complex administrative functions with professional expertise.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Core Administrative Services:</p>
          <div className="grid md:grid-cols-2 gap-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Communication Management</p>
              <ul className="space-y-1">
                <li>• Email organization & responses</li>
                <li>• Phone call handling</li>
                <li>• Customer inquiry management</li>
                <li>• Meeting coordination</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Document & Data</p>
              <ul className="space-y-1">
                <li>• Document creation & formatting</li>
                <li>• Data entry & database management</li>
                <li>• File organization & archiving</li>
                <li>• Report generation</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Financial Administration</p>
              <ul className="space-y-1">
                <li>• Invoice processing & tracking</li>
                <li>• Expense management</li>
                <li>• Payment follow-ups</li>
                <li>• Basic bookkeeping support</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Operations Support</p>
              <ul className="space-y-1">
                <li>• Calendar management</li>
                <li>• Travel arrangements</li>
                <li>• CRM updates & maintenance</li>
                <li>• Project coordination</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Each service is customized to your specific business needs and workflows. We integrate seamlessly with your existing tools and systems, whether that's Google Workspace, Microsoft 365, Salesforce, QuickBooks, or industry-specific platforms.
        </p>
      </div>
    )
  },
  {
    number: 3,
    icon: Zap,
    title: "How Quickly Can You Start Helping My Business?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We understand that administrative bottlenecks need immediate solutions. Our streamlined onboarding process gets you up and running within <strong>3-5 business days</strong>, with critical tasks being handled even sooner.
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Implementation Timeline:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground">Days 1-2: Setup & Integration</p>
              <p>Initial consultation, tool access setup, workflow documentation, priority task identification</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Days 3-5: Training & Handoff</p>
              <p>Team training on your processes, communication protocols established, first tasks completed</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Week 2+: Full Operations</p>
              <p>Complete administrative support active, regular reporting established, continuous optimization</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Most routine tasks (email management, scheduling, data entry) are handled within <strong>24 hours</strong> of assignment. Urgent requests receive same-day attention, ensuring nothing falls through the cracks.
        </p>
      </div>
    )
  }
];

export const automationFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Zap,
    title: "Why Should Automation Be a Priority for My Business?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Manual processes are the silent profit killer in modern business. Research shows that <strong>employees spend 19% of their time searching for information</strong> and another <strong>20% on repetitive manual tasks</strong> that could be automated. This isn't just an efficiency problem—it's a scalability crisis waiting to happen.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Critical Problems Automation Solves:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Human errors in data entry costing thousands in corrections</li>
            <li>• Bottlenecks preventing business growth without hiring</li>
            <li>• Inconsistent customer experiences due to manual follow-ups</li>
            <li>• Lost revenue from delayed lead responses</li>
            <li>• Team burnout from repetitive, soul-crushing tasks</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Companies that implement intelligent automation see an average <strong>80% reduction in processing time</strong> for routine tasks and achieve <strong>99.9% accuracy rates</strong>—far exceeding manual processes.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Settings,
    title: "What Parts of My Business Can Actually Be Automated?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          The scope of automation possibilities far exceeds what most business owners realize. If a process is repeatable and rule-based, it can likely be automated.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Automation Opportunities:</p>
          <div className="grid md:grid-cols-2 gap-4 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-2">Sales & Marketing</p>
              <ul className="space-y-1.5">
                <li>• Lead capture and instant assignment</li>
                <li>• Automated follow-up sequences</li>
                <li>• Email drip campaigns</li>
                <li>• Social media scheduling</li>
                <li>• Lead scoring</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Operations & Admin</p>
              <ul className="space-y-1.5">
                <li>• Invoice generation</li>
                <li>• Payment reminders</li>
                <li>• Document generation</li>
                <li>• Data synchronization</li>
                <li>• Report distribution</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          We build custom automation that connects your existing tools and delivers platform-optimized solutions designed specifically for your workflows.
        </p>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What Results Can I Expect and How Fast?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Most clients see immediate time savings once automation is deployed. Typical implementation takes 2-6 weeks with <strong>20-40 hours saved per week</strong> and <strong>95% error reduction</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">20-40hrs</div>
            <div className="text-sm text-muted-foreground">Time Saved Per Week</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Error Reduction</div>
          </div>
        </div>
      </div>
    )
  }
];

export const copywritingFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Target,
    title: "Why Does Professional Copy Matter So Much?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Words are your sales team that work 24/7. Yet most businesses lose 70-90% of potential customers due to poor messaging. Professional copywriting isn't about sounding fancy—it's about converting browsers into buyers.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Costly Copy Mistakes We Fix:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Vague value propositions that don't differentiate</li>
            <li>• Feature-focused copy instead of benefit-driven messaging</li>
            <li>• Weak calls-to-action that don't drive conversions</li>
            <li>• Inconsistent brand voice confusing your audience</li>
            <li>• Generic content that fails to address pain points</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Strategic copy improvements can <strong>increase conversion rates by 2-3x</strong> without changing anything else. Same traffic, same product—just better words can double or triple your revenue.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: FileText,
    title: "What Type of Copy Can You Create?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We deliver conversion-optimized copy across every customer touchpoint in your business. Our writers understand marketing psychology and persuasion frameworks.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Copywriting Services:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Sales & Marketing</p>
              <p>Landing pages, sales pages, email campaigns, ad copy, VSL scripts, webinars, lead magnets, case studies</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Website & Brand</p>
              <p>Homepage, about pages, service pages, product descriptions, blog posts, SEO content, brand messaging</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Every project includes strategic consultation, audience research, and unlimited revisions until you're satisfied.
        </p>
      </div>
    )
  },
  {
    number: 3,
    icon: Clock,
    title: "What's Your Process and Turnaround Time?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our process balances speed with strategic depth. Typical turnaround: landing pages (3-5 days), email sequences (5-7 days), full website (10-14 days).
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Process:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p><strong>Day 1:</strong> Strategy session and audience research</p>
            <p><strong>Days 2-3:</strong> Outline development and approval</p>
            <p><strong>Days 4-7:</strong> First draft delivered</p>
            <p><strong>Days 8-10:</strong> Unlimited revisions</p>
          </div>
        </div>
      </div>
    )
  }
];

export const funnelDesignFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Target,
    title: "Why Is a Strategic Funnel More Valuable Than Just a Website?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Traditional websites wait for visitors to figure out what to do. A strategically designed funnel is a conversion machine that guides every visitor toward a specific action. <strong>Funnel-optimized pages convert 5-10x higher</strong> than standard website pages.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Problems With Standard Websites:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Too many options leading to decision paralysis</li>
            <li>• No clear path from visitor to customer</li>
            <li>• Generic messaging that doesn't resonate</li>
            <li>• Slow load times killing conversions</li>
            <li>• No systematic lead capture or nurture</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our funnel designs are built on conversion psychology, persuasive architecture, and data-driven best practices. Every element is strategically chosen to maximize conversions.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Palette,
    title: "What's Included in Your Funnel Design Service?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We deliver complete, conversion-optimized funnels ready to deploy. This includes strategy, design, development, copywriting, and technical integration.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Complete Package:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Strategy & Planning</p>
              <p>Funnel mapping, conversion strategy, user journey design, competitive analysis, messaging framework</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Design & Development</p>
              <p>Custom page designs, responsive development, conversion-optimized layouts, fast loading, A/B testing setup</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Technical Integration</p>
              <p>Email platform, CRM, payment processors, analytics tracking, form automation, lead routing</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "How Long Does It Take and What Results Should I Expect?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Typical delivery: 14-21 days from kickoff to live funnel. Our funnels typically achieve <strong>15-35% conversion rates</strong> vs. 1-5% for standard sites.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">14-21 Days</div>
            <div className="text-sm text-muted-foreground">Delivery Time</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">15-35%</div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </div>
        </div>
      </div>
    )
  }
];

export const graphicDesignFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Palette,
    title: "Why Does Professional Design Matter for My Business?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You have <strong>50 milliseconds</strong> to make a first impression online. Poor design screams "amateur" and sends potential customers to competitors. Professional design isn't vanity—it's credibility, trust, and competitive advantage.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Design Impact:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• 94% of first impressions are design-related</li>
            <li>• Professional design increases perceived value by 400%</li>
            <li>• Consistent branding increases revenue by 33%</li>
            <li>• Quality visuals get 94% more views</li>
            <li>• Poor design drives away 38% of visitors immediately</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our design work creates strategic visual communications that reinforce your brand positioning, guide user attention, and drive specific business outcomes.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Award,
    title: "What Design Services Do You Offer?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We provide comprehensive graphic design covering every visual touchpoint—from brand identity to marketing campaigns to sales collateral.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Design Services:</p>
          <div className="grid md:grid-cols-2 gap-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Brand Identity</p>
              <ul className="space-y-1">
                <li>• Logo design</li>
                <li>• Brand style guides</li>
                <li>• Color palettes</li>
                <li>• Typography systems</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Marketing Materials</p>
              <ul className="space-y-1">
                <li>• Social media graphics</li>
                <li>• Ad creative</li>
                <li>• Email templates</li>
                <li>• Infographics</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Every project includes unlimited revisions, source files, and usage guidelines.
        </p>
      </div>
    )
  },
  {
    number: 3,
    icon: Clock,
    title: "What's Your Design Process and Turnaround Time?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Typical turnaround: Social graphics (24-48 hours), ad creative (2-3 days), presentations (3-5 days), brand identity (7-10 days).
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Process:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p><strong>Phase 1:</strong> Discovery and creative brief (1-2 days)</p>
            <p><strong>Phase 2:</strong> Concept development (2-3 days)</p>
            <p><strong>Phase 3:</strong> Refinement (2-4 days)</p>
            <p><strong>Phase 4:</strong> Finalization (1-2 days)</p>
          </div>
        </div>
      </div>
    )
  }
];

export const prospectOutreachFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Target,
    title: "Why Is Strategic Outreach Critical for Growth?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Waiting for customers to find you creates slow, unpredictable growth. Strategic outreach puts your solution directly in front of ideal prospects at scale. Companies that master outreach grow <strong>3-5x faster</strong>.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Problems DIY Outreach Faces:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Generic messaging that gets ignored</li>
            <li>• Inconsistent volume creating feast-or-famine</li>
            <li>• Poor targeting wasting time</li>
            <li>• Low response rates killing motivation</li>
            <li>• No systematic follow-up</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          We achieve <strong>25-40% open rates</strong> and <strong>8-15% response rates</strong>—10x better than typical cold outreach.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Users,
    title: "How Does Your Outreach System Work?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We handle everything from prospect identification to conversation scheduling, delivering qualified sales opportunities ready for your team.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Complete System:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Step 1: Profiling</p>
              <p>Identify your perfect prospects using firmographic data, intent data, and custom criteria</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Step 2: List Building</p>
              <p>Custom prospect lists, verified for accuracy, enriched with personalization data</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Step 3: Messaging</p>
              <p>Personalized sequences across email, LinkedIn, phone with A/B testing</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What Results Can I Expect and How Fast?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We start generating conversations within the first week. Typical results: <strong>20-50 qualified conversations per month</strong> with <strong>8-15% response rates</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">20-50</div>
            <div className="text-sm text-muted-foreground">Qualified Conversations/Month</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">8-15%</div>
            <div className="text-sm text-muted-foreground">Response Rate</div>
          </div>
        </div>
      </div>
    )
  }
];

export const slidedeckFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Presentation,
    title: "Why Do Professional Presentations Matter?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You have one shot to win that pitch. A poorly designed deck kills your chances regardless of how brilliant your idea is. <strong>63% of presentations fail due to poor visual communication</strong>, not weak content.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Presentation Killers We Fix:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Text-heavy slides audiences don't read</li>
            <li>• Confusing data visualization</li>
            <li>• Inconsistent design undermining credibility</li>
            <li>• Poor flow losing audience attention</li>
            <li>• Missing storytelling that fails to persuade</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our presentation design transforms complex ideas into compelling visual narratives that audiences understand, remember, and act on.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Award,
    title: "What's Included in Your Presentation Design?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We architect your entire narrative for maximum impact. Our process combines content strategy, storytelling, visual design, and presentation coaching.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Complete Package:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Content Strategy</p>
              <p>Narrative structure, message hierarchy, story flow, persuasion architecture</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Visual Design</p>
              <p>Custom slides, professional typography, data visualization, brand alignment</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: Clock,
    title: "How Long Does It Take?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Timeline depends on deck length. Small deck (10-15 slides): 2-3 days. Medium deck (20-30 slides): 4-6 days. Large deck (40+ slides): 7-10 days.
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Process:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p><strong>Day 1:</strong> Content review & strategy</p>
            <p><strong>Day 2:</strong> Narrative structure</p>
            <p><strong>Days 3-4:</strong> Design concepts</p>
            <p><strong>Days 5-6:</strong> Refinement & polish</p>
          </div>
        </div>
      </div>
    )
  }
];

export const socialMediaFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Share2,
    title: "Why Invest in Professional Social Media Management?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Social media is where your customers spend 2.5+ hours daily. Yet <strong>90% of businesses post inconsistently</strong> with no strategy. Professional management turns social from a time sink into a revenue driver.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Why DIY Fails:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Inconsistent posting killing algorithm reach</li>
            <li>• Generic content that doesn't engage</li>
            <li>• No clear strategy connecting to business goals</li>
            <li>• Time drain preventing focus on core business</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Clients typically see <strong>200-400% follower growth</strong> and <strong>5-10x engagement improvements</strong> within 90 days.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: BarChart,
    title: "What's Included in Your Social Media Service?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We provide comprehensive management covering strategy, content, community engagement, and growth across all major platforms.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Complete Management:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Strategy & Planning</p>
              <p>Custom strategy, content calendar, platform optimization, competitor analysis</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Content Creation</p>
              <p>Custom graphics, video editing, copywriting, hashtag strategy</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Community Management</p>
              <p>Comment responses, DM management, engagement, reputation monitoring</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "How Long Until I See Results?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You'll see engagement improvements within the first week, with compounding growth as algorithms recognize consistent, high-quality content.
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Growth Timeline:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p><strong>Month 1:</strong> 20-50% engagement increase</p>
            <p><strong>Month 2-3:</strong> 100-200% follower growth, 3-5x engagement</p>
            <p><strong>Month 4+:</strong> Sustained growth and business results</p>
          </div>
        </div>
      </div>
    )
  }
];

export const videoEditingFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Video,
    title: "Why Is Professional Video Editing Essential?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Video content generates <strong>1200% more shares</strong> than text and images combined. Poor editing makes even great footage unwatchable, while expert editing transforms average footage into compelling content.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Impact of Professional Editing:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• 80% of people will watch a video vs. 20% reading text</li>
            <li>• Quality editing increases watch-through by 300%</li>
            <li>• Professional videos shared 7x more frequently</li>
            <li>• Poor editing drives away 62% within 10 seconds</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our video editing transforms raw footage into polished, engaging content optimized for your platform and audience.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Sparkles,
    title: "What Video Editing Services Do You Provide?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We offer comprehensive video editing from basic cuts to advanced post-production. Our editors work with all footage types and deliver platform-optimized videos.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Services:</p>
          <div className="grid md:grid-cols-2 gap-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Core Editing</p>
              <ul className="space-y-1">
                <li>• Footage cutting & organization</li>
                <li>• Audio enhancement</li>
                <li>• Music & sound effects</li>
                <li>• Transitions</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Advanced Post</p>
              <ul className="space-y-1">
                <li>• Color grading</li>
                <li>• Motion graphics</li>
                <li>• Visual effects</li>
                <li>• Subtitles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: Clock,
    title: "What's Your Turnaround Time?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Short form (60-90 seconds): 1-2 days. Medium form (5-15 minutes): 3-5 days. Long form (30+ minutes): 7-10 days. Rush editing available in 24 hours.
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Process:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p><strong>Day 1:</strong> Footage review & brief</p>
            <p><strong>Days 2-3:</strong> Rough cut for approval</p>
            <p><strong>Days 4-5:</strong> Refinement with effects</p>
            <p><strong>Day 6:</strong> Final polish & delivery</p>
          </div>
        </div>
      </div>
    )
  }
];

export const vslCreationFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Target,
    title: "Why Do VSLs Convert So Much Better?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Video Sales Letters (VSLs) are the highest-converting sales tool in digital marketing, achieving <strong>3-10x higher conversion rates</strong> than sales pages alone. They combine psychological persuasion, visual storytelling, and strategic pacing.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Why VSLs Outperform:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Control the sales narrative completely</li>
            <li>• Build emotional connection through voice and visuals</li>
            <li>• Maintain engagement longer (18min vs. 37 seconds)</li>
            <li>• Overcome skepticism with proof</li>
            <li>• Create urgency driving immediate action</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our VSL creation delivers complete sales presentations that work 24/7 converting cold traffic into paying customers.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Award,
    title: "What's Included in Your VSL Creation?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We create complete VSL systems including persuasive scripting, professional production, strategic pacing, and landing page optimization.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Complete Package:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Strategic Script</p>
              <p>Offer analysis, audience research, proven frameworks, emotional triggers, objection handling</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Video Production</p>
              <p>Professional voiceover, B-roll footage, screen recordings, motion graphics, background music</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Landing Page</p>
              <p>VSL page design, video player optimization, CTA placement, trust elements, mobile optimization</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What Results Can I Expect?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          VSL creation takes 2-3 weeks. Our VSLs achieve <strong>3-8% conversion for cold traffic</strong> and <strong>15-30% for warm audiences</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">3-8%</div>
            <div className="text-sm text-muted-foreground">Cold Traffic Conversion</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">14-21 Days</div>
            <div className="text-sm text-muted-foreground">Production Timeline</div>
          </div>
        </div>
      </div>
    )
  }
];

export const aiEmployeeFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Bot,
    title: "Why Should I Consider AI Employees?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          AI employees work 24/7/365 without breaks, never call in sick, scale infinitely, and cost a fraction of human employees. Companies implementing AI employees report <strong>300-1000% ROI</strong> within 90 days.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Transformative Benefits:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Handle unlimited volume without hiring costs</li>
            <li>• Respond to customers instantly, 24/7/365</li>
            <li>• Eliminate human errors in repetitive processes</li>
            <li>• Scale operations without proportional costs</li>
            <li>• Free human team for strategic work</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our AI employee creation builds custom AI agents tailored to your business—from customer service to sales assistants, content creators, and data analysts.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Sparkles,
    title: "What Can AI Employees Do?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          AI employees can handle virtually any digital task that follows patterns. We build custom AI agents trained on your data, integrated with your systems.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">AI Functions:</p>
          <div className="grid md:grid-cols-2 gap-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Customer-Facing</p>
              <ul className="space-y-1">
                <li>• 24/7 support chatbots</li>
                <li>• Sales qualification</li>
                <li>• Product recommendations</li>
                <li>• Order tracking</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Operations</p>
              <ul className="space-y-1">
                <li>• Data entry & processing</li>
                <li>• Document analysis</li>
                <li>• Report generation</li>
                <li>• Invoice processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What's the Implementation Process?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Implementation takes 2-4 weeks. ROI is often immediate with <strong>70-90% cost reduction</strong> vs. hiring human employees.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">70-90%</div>
            <div className="text-sm text-muted-foreground">Cost Reduction</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">24/7/365</div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </div>
        </div>
      </div>
    )
  }
];

export const integrationServicesFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Plug,
    title: "Why Are System Integrations Critical?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Disconnected systems waste <strong>4-6 hours weekly</strong> on manual data entry. Professional integrations eliminate these friction points entirely.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Problems Integrations Solve:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Manual data entry (error-prone, time-consuming)</li>
            <li>• Disconnected customer data</li>
            <li>• Information silos preventing decisions</li>
            <li>• Delayed updates causing missed opportunities</li>
            <li>• Inability to scale without exponential effort</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our integration services connect your entire business ecosystem into a seamless, automated network where data flows instantly and accurately.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Settings,
    title: "What Types of Integrations Do You Build?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We build custom integrations between any systems—from popular SaaS platforms to proprietary legacy systems.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Integration Solutions:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Common Integrations</p>
              <p>CRM ↔ Marketing, Payment ↔ Accounting, E-commerce ↔ Shipping, Calendar ↔ Communication</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Custom API Integrations</p>
              <p>Proprietary systems, legacy software, unique SaaS combinations</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What's the Timeline and ROI?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Simple integrations: 1-3 days. Moderate: 5-10 days. Complex: 2-4 weeks. ROI is immediate as manual processes are eliminated.
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Example ROI:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p>5 hours/week manual data entry at $50/hour = $13K/year wasted</p>
            <p>Integration cost: $2-8K one-time</p>
            <p>Payback: 2-8 months, then pure savings forever</p>
          </div>
        </div>
      </div>
    )
  }
];

export const migrationServicesFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Database,
    title: "Why Should I Migrate to Modern Systems?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Legacy systems are expensive anchors. Companies that migrate report <strong>40-60% reduction in operational costs</strong> and <strong>2-3x productivity improvements</strong>.
        </p>
        
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-2">Signs You Need to Migrate:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• High maintenance costs for outdated software</li>
            <li>• Can't integrate with modern tools</li>
            <li>• Slow performance limiting productivity</li>
            <li>• Security concerns with unsupported systems</li>
            <li>• Difficulty scaling or adding functionality</li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Our migration services handle the entire transition without disrupting operations—zero downtime, zero data loss.
        </p>
      </div>
    )
  },
  {
    number: 2,
    icon: Shield,
    title: "How Do You Ensure Zero Data Loss?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our battle-tested process eliminates risk through meticulous planning, comprehensive testing, and phased rollouts.
        </p>

        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg my-4">
          <p className="font-semibold text-foreground mb-3">Risk-Free Process:</p>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Phase 1: Assessment</p>
              <p>Complete audit, data mapping, risk identification, rollback plans</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Phase 2: Preparation</p>
              <p>New system setup, data cleaning, custom development, testing environment</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Phase 3: Testing</p>
              <p>Test migration, data validation, functionality testing, issue resolution</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    number: 3,
    icon: Clock,
    title: "How Long Does Migration Take?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Simple migration: 1-2 weeks. Moderate: 3-6 weeks. Complex: 2-3 months. Enterprise: 3-6 months.
        </p>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
          <p className="font-semibold text-foreground mb-3">Downtime:</p>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p>Most migrations: &lt;2 hours downtime (overnight/weekend)</p>
            <p>Mission-critical systems: Zero downtime through parallel running</p>
          </div>
        </div>
      </div>
    )
  }
];

export const coursesFAQs: FAQItem[] = [
  {
    number: 1,
    icon: CheckCircle,
    title: "How Do the Courses Work?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our courses are 100% self-paced, meaning you can learn on your own schedule. Once enrolled, you get immediate access to all course materials including video lessons, downloadable resources, and practical exercises.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">What to Expect:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Instant access upon enrollment—start learning immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Work through lessons at your own pace, no deadlines</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Pause and resume anytime—your progress is saved</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Practical assignments to apply what you learn</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Package,
    title: "What Topics Are Covered?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our learning hub covers all aspects of starting, running, and scaling a successful business. Content is organized into six comprehensive categories.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Starting a Business</h4>
            <p className="text-xs text-muted-foreground">Business planning, validation, and launch strategies</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Legal & Registration</h4>
            <p className="text-xs text-muted-foreground">Entity formation, compliance, and legal essentials</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Marketing & Sales</h4>
            <p className="text-xs text-muted-foreground">Lead generation, conversion, and growth tactics</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Finance & Accounting</h4>
            <p className="text-xs text-muted-foreground">Bookkeeping, budgeting, and financial management</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Operations & Systems</h4>
            <p className="text-xs text-muted-foreground">Workflows, automation, and efficiency tools</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Team & Hiring</h4>
            <p className="text-xs text-muted-foreground">Recruitment, management, and team building</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    icon: Award,
    title: "Do I Get Certificates?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Yes! Upon completing a course, you receive a certificate of completion that you can download and share on LinkedIn or include in your professional portfolio.
        </p>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Certificate Benefits
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Verifiable credentials to showcase your skills</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Shareable on LinkedIn and professional profiles</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Demonstrate commitment to professional development</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 4,
    icon: Clock,
    title: "How Long Do I Have Access?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You get lifetime access to all courses you enroll in. This means you can revisit the material anytime, even years after completing it.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Lifetime Access</h4>
              <p className="text-sm text-muted-foreground">No expiration—learn at your own pace, forever</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Free Updates</h4>
              <p className="text-sm text-muted-foreground">When courses are updated, you get the new content automatically</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
              <Settings className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Multi-Device Access</h4>
              <p className="text-sm text-muted-foreground">Learn on desktop, tablet, or mobile—your progress syncs everywhere</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 5,
    icon: Video,
    title: "What Format Are the Lessons?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our learning hub offers multiple formats to match different learning styles and schedules.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Video Courses</h4>
            </div>
            <p className="text-sm text-muted-foreground">HD video lessons with clear explanations and real-world examples</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-secondary" />
              <h4 className="font-semibold text-foreground">Live Workshops</h4>
            </div>
            <p className="text-sm text-muted-foreground">Interactive sessions with Q&A and hands-on exercises</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Presentation className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-foreground">Live Trainings</h4>
            </div>
            <p className="text-sm text-muted-foreground">Scheduled sessions covering specific topics in depth</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Resources</h4>
            </div>
            <p className="text-sm text-muted-foreground">Downloadable templates, guides, and reference materials</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 6,
    icon: Users,
    title: "Who Are the Instructors?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Our courses are created by experienced entrepreneurs, industry experts, and business professionals who have real-world success in their respective fields.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-foreground">Instructor Qualifications:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Proven track record of building successful businesses</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Years of hands-on experience in their specialty areas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Practical knowledge that translates to real results</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Commitment to student success and actionable teaching</span>
            </li>
          </ul>
        </div>
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Our Promise:</span> Every instructor brings practical, real-world experience—not just theory. You'll learn strategies and tactics that actually work in today's business environment.
          </p>
        </div>
      </div>
    ),
  }
];

export function getFAQsByServiceSlug(slug: string): FAQItem[] {
  const faqMap: Record<string, FAQItem[]> = {
    "paid-ads": paidAdsFAQs,
    "administrative-services": administrativeServicesFAQs,
    "automation": automationFAQs,
    "copywriting": copywritingFAQs,
    "funnel-design": funnelDesignFAQs,
    "graphic-design": graphicDesignFAQs,
    "prospect-outreach": prospectOutreachFAQs,
    "slide-decks": slidedeckFAQs,
    "social-media": socialMediaFAQs,
    "video-editing": videoEditingFAQs,
    "vsl-creation": vslCreationFAQs,
    "ai-employee": aiEmployeeFAQs,
    "integration-services": integrationServicesFAQs,
    "migration-services": migrationServicesFAQs,
    "courses": coursesFAQs,
  };

  return faqMap[slug] || paidAdsFAQs;
}