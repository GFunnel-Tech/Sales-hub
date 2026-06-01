import { Link } from "react-router-dom";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  Target,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  Users,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const aceFramework = [
  {
    phase: "Acquisition",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Everything that grabs attention and brings it into your system",
    activities: ["Ads & Landing Pages", "Cold Outreach", "Referrals", "Organic Social"],
    priorities: [
      "Track channel ROI at capture",
      "Reply instantly to inbound leads",
      "Qualify quickly through surveys or calls"
    ]
  },
  {
    phase: "Creation",
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description: "Where you convert attention into a deal — the human magic happens here",
    activities: ["Discovery Call", "Presentation Stack", "Ask for Order", "Onboarding"],
    priorities: [
      "Use the 7-step script structure",
      "Record calls for quality assurance",
      "Handle objections with the Loop"
    ]
  },
  {
    phase: "Expansion",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Post-sale growth — where lifetime value is created",
    activities: ["Referrals", "Upsells", "Retention", "Additional Services"],
    priorities: [
      "Systematize referral asks",
      "Demonstrate results to enable upsells",
      "Create retention offers that build stickiness"
    ]
  }
];

const trainingModules = [
  {
    title: "The 7-Step Sales Process",
    description: "Master the complete sales methodology from handshake to handoff",
    icon: Target,
    href: "/sales-process",
    duration: "45 min",
    level: "Foundation"
  },
  {
    title: "Objection Handling Mastery",
    description: "Turn 'no' into 'yes' with the Isolate → Accept → Create → Expand loop",
    icon: MessageCircle,
    href: "/objection-playbook",
    duration: "30 min",
    level: "Intermediate"
  },
  {
    title: "DPO Questioning Framework",
    description: "Discover burning desires with Dream → Pain → Obstacle questioning",
    icon: Lightbulb,
    href: "/sales-process",
    duration: "20 min",
    level: "Foundation"
  },
  {
    title: "Stacked Presentations",
    description: "Present Low/Medium/High options to guide prospects to the ideal choice",
    icon: TrendingUp,
    href: "/sales-process",
    duration: "25 min",
    level: "Advanced"
  }
];

const keyPrinciples = [
  {
    principle: "Process Beats Pitch",
    explanation: "A repeatable system translates value into customers who trust and act. Tricks fail; systems scale."
  },
  {
    principle: "Pain Determines Price",
    explanation: "The depth of a client's pain determines what you can charge. Surface the burning desire — family time, financial security, legacy."
  },
  {
    principle: "Objections = Information",
    explanation: "When prospects say 'I need to think about it,' they're asking for more clarity, not more time."
  },
  {
    principle: "80/20 Listening Rule",
    explanation: "Spend 80% of the call listening to their dreams, pains, and obstacles. The more they talk, the more they sell themselves."
  },
  {
    principle: "Future Pace Everything",
    explanation: "Set expectations before each phase: 'I'll ask questions, then recommend a plan. At the end we'll decide next steps.'"
  },
  {
    principle: "Make the Path Obvious",
    explanation: "Your job is to supply information, accept emotion, and make the path to the outcome crystal clear."
  }
];

export default function SalesTraining() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesHubNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">Training Resources</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Training</h1>
          <p className="text-muted-foreground max-w-2xl">
            Learn the proven methodology that achieves 70-90% conversion rates. 
            Process beats pitch — master the system and scale your results.
          </p>
        </div>

        {/* ACE Framework */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">The ACE Framework</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            ACE — <strong>Acquisition, Creation, Expansion</strong> — is the core loop that maps every buyer interaction 
            into a stage where you can measure and improve conversion.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {aceFramework.map((phase, index) => (
              <Card key={phase.phase} className={`relative overflow-hidden border-2 ${phase.borderColor}`}>
                {index < aceFramework.length - 1 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center z-10">
                    <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-xl ${phase.bgColor}`}>
                      <phase.icon className={`w-6 h-6 ${phase.color}`} />
                    </div>
                    <CardTitle className="text-xl">{phase.phase}</CardTitle>
                  </div>
                  <CardDescription>{phase.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Activities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.activities.map((activity) => (
                        <Badge key={activity} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Priorities</p>
                    <ul className="space-y-1.5">
                      {phase.priorities.map((priority, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {priority}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Training Modules */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Training Modules</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {trainingModules.map((module) => (
              <Link key={module.title} to={module.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <module.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {module.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{module.duration}</Badge>
                          <Badge variant="secondary" className="text-xs">{module.level}</Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Key Principles */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Key Principles</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Internalize these principles and your sales conversations will transform.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyPrinciples.map((item) => (
              <Card key={item.principle} className="bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-primary mb-2">{item.principle}</h3>
                  <p className="text-sm text-muted-foreground">{item.explanation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-primary-foreground mb-1">
                    Ready to Apply What You've Learned?
                  </h2>
                  <p className="text-sm text-primary-foreground/80">
                    Start using the 7-step process on your next sales call
                  </p>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/sales-process" className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Start Sales Process
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
