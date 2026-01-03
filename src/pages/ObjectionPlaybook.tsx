import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Heart, 
  Lightbulb, 
  Expand, 
  MessageCircle,
  Clock,
  DollarSign,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const objectionLoop = [
  {
    step: 1,
    title: "Isolate",
    icon: Search,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    description: "Ask a clarifying question to understand the real objection",
    example: '"When you say \'I need to think about it,\' what specifically would you like to think about?"',
    tips: [
      "Don't assume you know what they mean",
      "The first objection is often a smokescreen",
      "Get to the root cause before addressing"
    ]
  },
  {
    step: 2,
    title: "Accept (Acquire)",
    icon: Heart,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    description: "Acknowledge the emotion without arguing - this builds rapport",
    example: '"Totally — money is tight right now. I completely understand that."',
    tips: [
      "Never argue or get defensive",
      "Repeat their concern back to them",
      "This lowers their defenses"
    ]
  },
  {
    step: 3,
    title: "Create",
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    description: "Offer a logical bridge that addresses their specific objection",
    example: '"If we build this plan that creates X result in 90 days, would that outcome be worth the investment?"',
    tips: [
      "Connect their pain to your solution",
      "Use their words and desires",
      "Make the path to outcome obvious"
    ]
  },
  {
    step: 4,
    title: "Expand & Close",
    icon: Expand,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    description: "Reframe the consequence of inaction relative to their burning desire",
    example: '"Great — then let\'s choose a plan that gives you X result and structure a payment that fits your cash flow. Which would you prefer?"',
    tips: [
      "Tie back to their dream/pain",
      "Present clear options",
      "Ask for commitment with a clear next step"
    ]
  }
];

const commonObjections = [
  {
    objection: "I need to think about it",
    icon: Clock,
    category: "Stall",
    responses: [
      {
        label: "Isolate",
        script: "Totally — most people who say that need more information, not time. What's your top concern so I can answer it for you now?"
      },
      {
        label: "Bridge",
        script: "I understand. What specifically would you like to think about? Is it the investment, the timing, or something about the program itself?"
      },
      {
        label: "Close",
        script: "If I could address that concern right now, would you be comfortable moving forward today?"
      }
    ]
  },
  {
    objection: "I can't afford it",
    icon: DollarSign,
    category: "Money",
    responses: [
      {
        label: "Accept",
        script: "I hear you — money is a real concern, especially in today's economy. Can I ask you something?"
      },
      {
        label: "Bridge",
        script: "If this program delivers [specific result they mentioned], would that be worth the investment? What's the cost of NOT solving this problem?"
      },
      {
        label: "Options",
        script: "Let's look at options that fit your situation. We have [payment plan/starter option] that might work better for your cash flow right now."
      }
    ]
  },
  {
    objection: "I need to talk to my spouse/partner",
    icon: Users,
    category: "Third Party",
    responses: [
      {
        label: "Validate",
        script: "That's great that you make decisions together. What do you think they'd be most concerned about?"
      },
      {
        label: "Bridge",
        script: "If your [spouse/partner] was here right now, what questions do you think they'd want answered?"
      },
      {
        label: "Close",
        script: "Let's get them on a quick call together so we can address their questions. When would work for all three of us?"
      }
    ]
  },
  {
    objection: "Send me more information",
    icon: FileText,
    category: "Stall",
    responses: [
      {
        label: "Clarify",
        script: "Absolutely — what specific information would help you make a decision? I want to make sure I send you exactly what you need."
      },
      {
        label: "Bridge",
        script: "I can definitely do that. But I've found that information without context doesn't always help. What's your main concern I can address right now?"
      },
      {
        label: "Alternative",
        script: "I'll send that over. But while I have you — if the information checks out, are you ready to move forward?"
      }
    ]
  }
];

export default function ObjectionPlaybook() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">Sales Training</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">Objection Playbook</h1>
          <p className="text-muted-foreground max-w-2xl">
            Master the art of turning "no" into "yes" with the proven Objection Loop methodology. 
            Objections are not rejections — they're requests for more information.
          </p>
        </div>

        {/* The Objection Loop */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            The Objection Loop
          </h2>
          <p className="text-muted-foreground mb-6">
            This loop can be repeated multiple times until the objection is truly resolved. 
            Most prospects use smokescreens because they lack information, confidence, or trust.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {objectionLoop.map((step, index) => (
              <Card key={step.step} className="relative overflow-hidden">
                {index < objectionLoop.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/30 hidden lg:block z-10" />
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${step.bgColor}`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">Step {step.step}</Badge>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm italic text-foreground">{step.example}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Common Objections */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Common Objections & Scripts</h2>
          <p className="text-muted-foreground mb-6">
            Ready-to-use responses for the most common objections you'll encounter. 
            Customize these to fit your product and personality.
          </p>
          
          <div className="space-y-4">
            {commonObjections.map((item) => (
              <Card key={item.objection}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <item.icon className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">"{item.objection}"</CardTitle>
                        <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {item.responses.map((response, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-4">
                        <Badge variant="outline" className="mb-2">{response.label}</Badge>
                        <p className="text-sm text-foreground italic">"{response.script}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Principles */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Key Principles to Remember</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Objections = Information Requests</p>
                    <p className="text-sm text-muted-foreground">They're not saying no — they need more clarity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">First Objection = Smokescreen</p>
                    <p className="text-sm text-muted-foreground">The real concern is usually underneath</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Accept, Don't Argue</p>
                    <p className="text-sm text-muted-foreground">Validation builds trust faster than logic</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Loop Until Resolved</p>
                    <p className="text-sm text-muted-foreground">Repeat the process for each new objection</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
