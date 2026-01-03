import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Users, Clock } from "lucide-react";
import { getRatioColor } from "@/lib/calculators";

interface ContextualAdviceProps {
  ltgpCacRatio: number;
  bestTierName: string;
}

export const ContextualAdvice = ({ ltgpCacRatio, bestTierName }: ContextualAdviceProps) => {
  const color = getRatioColor(ltgpCacRatio);

  const advice = {
    red: {
      icon: AlertCircle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      title: "⚠️ Profitability Below Healthy Levels",
      message: "Your LTGP:CAC ratio indicates challenges that need addressing:",
      suggestions: [
        { icon: Users, text: "Increase close rate with better lead qualification and sales training" },
        { icon: DollarSign, text: "Reduce service costs through operational efficiency improvements" },
        { icon: TrendingUp, text: "Increase contract value with upsells, add-ons, or premium packages" },
        { icon: Clock, text: "Improve retention with better customer service and loyalty programs" }
      ]
    },
    yellow: {
      icon: AlertTriangle,
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      title: "✓ Acceptable Profitability",
      message: "Your business model is working, but there's room for optimization:",
      suggestions: [
        { icon: TrendingUp, text: "Test higher-intent advertising platforms to improve lead quality" },
        { icon: DollarSign, text: "Optimize ad creative and targeting to lower cost per lead" },
        { icon: Clock, text: "Extend customer retention with loyalty programs and excellent service" },
        { icon: Users, text: "Refine sales process to increase close rate by 5-10%" }
      ]
    },
    green: {
      icon: CheckCircle,
      iconColor: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
      title: "🎉 Excellent Profitability!",
      message: "Your business model is highly profitable. Consider these growth strategies:",
      suggestions: [
        { icon: TrendingUp, text: "Scale your ad spend to grow faster while maintaining profitability" },
        { icon: DollarSign, text: "Reinvest profits into premium services to increase customer lifetime value" },
        { icon: Users, text: "Expand to new geographic markets with proven campaign strategies" },
        { icon: Clock, text: `We recommend starting with the ${bestTierName} tier for optimal results` }
      ]
    }
  };

  const currentAdvice = advice[color];
  const Icon = currentAdvice.icon;

  return (
    <Card className={`p-6 ${currentAdvice.bgColor} border-2 ${currentAdvice.borderColor}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-background/50`}>
          <Icon className={`w-6 h-6 ${currentAdvice.iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-foreground mb-2">{currentAdvice.title}</h4>
          <p className="text-sm text-muted-foreground mb-4">{currentAdvice.message}</p>
          <div className="space-y-2">
            {currentAdvice.suggestions.map((suggestion, idx) => {
              const SuggestionIcon = suggestion.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <SuggestionIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{suggestion.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
