import { ArrowLeft, ExternalLink, Compass, Sparkles, BookOpen, Users, Lightbulb, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

const exploreCategories = [
  {
    icon: Lightbulb,
    title: "Validate & Launch",
    description: "Test your ideas, find your market, and launch with confidence—whether it's your first venture or your fifth."
  },
  {
    icon: BookOpen,
    title: "Learn & Grow",
    description: "Courses, workshops, and masterclasses for every stage of your entrepreneurial journey."
  },
  {
    icon: Users,
    title: "Connect & Collaborate",
    description: "Join a community of founders, creators, and business owners building something meaningful."
  },
  {
    icon: Rocket,
    title: "Scale & Optimize",
    description: "Tools, templates, and strategies to grow from side hustle to sustainable business."
  }
];

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Navigation */}
          <Link 
            to="/learning-hub" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Learning Hub</span>
          </Link>

          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/25">
              <Compass className="w-10 h-10 text-accent-foreground" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Resources for Every Entrepreneur
            </h1>

            {/* Tagline */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're launching a startup, growing a freelance career, or scaling an established business—find the training and tools that fit your path.
            </p>

            {/* Primary CTA */}
            <Button 
              variant="gradient" 
              size="lg" 
              className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/25" 
              asChild
            >
              <a href="https://www.gfunnel.com/explore" target="_top" rel="noopener noreferrer">
                <Sparkles className="w-5 h-5" />
                Explore Now
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Built for Founders Like You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {exploreCategories.map((category, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <category.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Your Journey, Your Way
            </h2>
            <p className="text-muted-foreground mb-6">
              No matter where you are in your entrepreneurial journey, there's something here for you. Explore at your own pace.
            </p>
            <Button variant="gradient" className="gap-2" asChild>
              <a href="https://www.gfunnel.com/explore" target="_top" rel="noopener noreferrer">
                Start Exploring
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ExplorePage;
