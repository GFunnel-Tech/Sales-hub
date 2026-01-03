import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Rocket } from "lucide-react";
import { QuickActionContent } from "@/lib/serviceConfigs";

interface QuickActionsProps {
  discoveryUrl?: string;
  quickActionContent?: QuickActionContent;
}

export const QuickActions = ({ 
  discoveryUrl = "https://www.gfunnel.com/discover?services=paid-advertisement",
  quickActionContent = {
    statValue: "24/7",
    statLabel: "Support Available",
    description: "Get started today and see leads within 48 hours"
  }
}: QuickActionsProps) => {
  
  const scrollToForm = () => {
    const formElement = document.getElementById("intake-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Card className="relative p-6 shadow-lg border-border">
      <h3 className="text-lg font-bold mb-4 text-foreground">Quick Actions</h3>
      <div className="space-y-3">
        <Button 
          variant="gradient"
          className="w-full justify-start" 
          size="lg"
          onClick={scrollToForm}
        >
          <Rocket className="w-5 h-5 mr-2" />
          Get Started
        </Button>

        <Button 
          variant="gradient-secondary" 
          className="w-full justify-start"
          size="lg"
          onClick={() => window.open(discoveryUrl, "_blank")}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Schedule Discovery
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-accent mb-1">{quickActionContent.statValue}</div>
          <div className="text-sm text-muted-foreground">{quickActionContent.statLabel}</div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {quickActionContent.description}
        </p>
      </div>
    </Card>
  );
};
