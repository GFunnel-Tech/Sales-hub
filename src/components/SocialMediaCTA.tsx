import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, TrendingUp, Users, MessageCircle, ArrowRight } from "lucide-react";

export const SocialMediaCTA = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <Card className="max-w-5xl mx-auto p-8 md:p-12 bg-gradient-to-br from-secondary/10 via-background to-primary/10 border-2 border-primary/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Organic + Paid Strategy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Complement Your Paid Ads with Organic Social Media
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Maximize your marketing ROI by combining paid advertising with a strategic organic social media presence. Build brand authority, engage your audience, and create a content ecosystem that supports your ad campaigns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Brand Authority</h3>
              <p className="text-sm text-muted-foreground">
                Establish credibility and trust through consistent, valuable content
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mb-3">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Audience Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Build relationships and community around your brand
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Content Amplification</h3>
              <p className="text-sm text-muted-foreground">
                Organic posts support and enhance your paid campaign messaging
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="group" asChild>
              <a href="#social-media-strategy">
                View Social Media Strategy
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              See how paid ads and organic social work together
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
