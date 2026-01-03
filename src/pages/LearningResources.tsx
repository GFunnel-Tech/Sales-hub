import { PartnerNavigation } from "@/components/PartnerNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ExternalLink,
  Play,
  Image,
  MessageSquare,
  Users,
  Zap,
  Rocket,
  Calendar,
  GraduationCap,
  Sparkles
} from "lucide-react";

const quickAccessItems = [
  {
    title: "Getting Started",
    description: "Essential onboarding resources",
    icon: Rocket,
    href: "https://gfunnel.com/view-course-profile/partner-program",
    gradient: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-600"
  },
  {
    title: "Upcoming Events",
    description: "Webinars and live sessions",
    icon: Calendar,
    href: "#",
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600"
  },
  {
    title: "Upcoming Workshops",
    description: "Hands-on training sessions",
    icon: GraduationCap,
    href: "#",
    gradient: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600"
  },
  {
    title: "Platform Updates",
    description: "Latest features and news",
    icon: Sparkles,
    href: "#",
    gradient: "from-rose-500/20 to-rose-600/10",
    iconColor: "text-rose-600"
  },
];

const resourceCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    description: "Essential resources for new partners",
    resources: [
      { name: "Partner Onboarding Guide", type: "PDF", icon: FileText },
      { name: "Commission Structure Overview", type: "Video", icon: Video },
      { name: "Dashboard Tutorial", type: "Video", icon: Video },
      { name: "First Sale Playbook", type: "PDF", icon: FileText },
    ]
  },
  {
    title: "Marketing Materials",
    icon: Image,
    description: "Ready-to-use promotional content",
    resources: [
      { name: "Social Media Graphics Pack", type: "ZIP", icon: Download },
      { name: "Email Templates", type: "DOC", icon: FileText },
      { name: "Landing Page Templates", type: "Link", icon: ExternalLink },
      { name: "Ad Creative Library", type: "Link", icon: ExternalLink },
    ]
  },
  {
    title: "Sales Learning",
    icon: MessageSquare,
    description: "Scripts and techniques that work",
    resources: [
      { name: "Discovery Call Script", type: "PDF", icon: FileText },
      { name: "Objection Handling Guide", type: "PDF", icon: FileText },
      { name: "Product Demo Walkthrough", type: "Video", icon: Video },
      { name: "Closing Techniques", type: "Video", icon: Video },
    ]
  },
  {
    title: "Team Building",
    icon: Users,
    description: "Grow and manage your downline",
    resources: [
      { name: "Recruiting Best Practices", type: "PDF", icon: FileText },
      { name: "Partner Learning Framework", type: "Video", icon: Video },
      { name: "Team Meeting Templates", type: "DOC", icon: FileText },
      { name: "Duplication System", type: "Video", icon: Video },
    ]
  },
];

const featuredLearning = [
  {
    title: "Partner Success Masterclass",
    description: "From first sale to building a team",
    image: "🎓"
  },
  {
    title: "Weekly Partner Calls",
    description: "Live sessions with Q&A updates",
    image: "📞"
  },
  {
    title: "Case Study Library",
    description: "Real success stories from partners",
    image: "📊"
  },
];

const supportChannels = [
  { name: "Partner Support Email", value: "partners@gfunnel.com", icon: MessageSquare, link: "mailto:partners@gfunnel.com" },
  { name: "Private Partner Community", value: "Partner Program Module", icon: Users, link: "https://gfunnel.com/view-course-profile/partner-program" },
  { name: "Weekly Office Hours", value: "Tuesdays 2PM EST", icon: Video },
];

export default function LearningResources() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <PartnerNavigation />
      
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">
              <BookOpen className="w-4 h-4" />
              Learning & Resources
            </div>
            <h1 className="text-headline mb-4">Everything You Need To Succeed</h1>
            <p className="text-lg text-muted-foreground">
              We don't just give you a link—we give you the tools to win
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-section-title mb-8">Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block"
              >
                <Card className="card-hover h-full">
                  <CardContent className={`p-5 bg-gradient-to-br ${item.gradient} rounded-lg`}>
                    <item.icon className={`w-8 h-8 ${item.iconColor} mb-3`} />
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-section-title mb-8">Featured Learning</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredLearning.map((item) => (
              <Card key={item.title} className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <span className="text-4xl mb-4">{item.image}</span>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <Button className="w-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-section-title mb-8">Resource Library</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resourceCategories.map((category) => (
              <Card key={category.title} className="card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="icon-container">
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.resources.map((resource) => (
                      <li key={resource.name}>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <resource.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{resource.name}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-section-title mb-4">Partner Support</h2>
            <p className="text-muted-foreground">
              Have questions? We're here to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {supportChannels.map((channel) => (
              <Card key={channel.name} className={channel.link ? "cursor-pointer hover:border-accent transition-colors" : ""}>
                {channel.link ? (
                  <a href={channel.link} target="_blank" rel="noopener noreferrer">
                    <CardContent className="p-4 text-center">
                      <channel.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                      <h3 className="font-semibold text-sm mb-1">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{channel.value}</p>
                    </CardContent>
                  </a>
                ) : (
                  <CardContent className="p-4 text-center">
                    <channel.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-1">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">{channel.value}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
