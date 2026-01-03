import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

const allPlatforms = [
  "Meta Suite (Facebook, Instagram, Messenger, WhatsApp)",
  "Google (Search, Pmax, Display, Shopping, Demand Gen)",
  "YouTube Video Ads",
  "LinkedIn (Feed + Message Ads)",
  "TikTok",
  "Snapchat",
  "Spotify Audio",
  "Bing Search",
  "Direct Mail",
  "Local Service Ads"
];

export const PlatformComparison = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Complete Platform Coverage</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All platforms managed through AI-powered automation
          </p>
        </div>
        
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {allPlatforms.map((platform, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{platform}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-bold mb-4 text-foreground">Platform Activation by Tier</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><Badge variant="outline" className="mr-2">Starter</Badge> Meta Suite</p>
              <p><Badge variant="outline" className="mr-2">Growth</Badge> Meta + Google + YouTube</p>
              <p><Badge variant="outline" className="mr-2">Premium</Badge> All platforms activated</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
