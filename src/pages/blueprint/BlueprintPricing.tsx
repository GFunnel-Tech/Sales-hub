import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { PRICING_PLANS } from "@/lib/blueprintConfig";
import { ArrowRight, Check, Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function BlueprintPricing() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const [selectedPlan, setSelectedPlan] = useState(session.selectedPlan || "");
  const [customRequest, setCustomRequest] = useState(session.customRequest || "");
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(8);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    updateSession({ selectedPlan, customRequest });
    navigate("/blueprint/completion");
  };

  return (
    <BlueprintLayout
      title="Choose Your Plan"
      subtitle="Select the best option for your needs"
      currentPage={8}
      backPath="/blueprint/presentation"
    >
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {PRICING_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "cursor-pointer transition-all relative",
              selectedPlan === plan.id
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50",
              plan.recommended && "border-primary/50"
            )}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" />
                Recommended
              </div>
            )}
            <CardContent className="p-5 pt-6">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary mt-1">{plan.price}</p>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full"
              >
                {selectedPlan === plan.id ? "Selected" : "Select"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Request */}
      <Collapsible open={showCustom} onOpenChange={setShowCustom}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full mb-2">
            Custom Request
            {showCustom ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Have specific requirements? Describe what you need:
              </p>
              <Textarea
                placeholder="Describe any custom requirements or modifications..."
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Free Trial CTA */}
      <Card className="mb-6 bg-muted/50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Not ready to commit? 
            <Button 
              variant="link" 
              className="px-1"
              onClick={() => {
                setSelectedPlan("free_trial");
                handleContinue();
              }}
            >
              Start with a free trial
            </Button>
          </p>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button 
        onClick={handleContinue} 
        className="w-full" 
        size="lg"
        disabled={!selectedPlan}
      >
        Continue to Complete Session
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Tip */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> Present all three options to anchor value. 
          Guide them toward the recommended plan based on their specific needs.
        </p>
      </div>
    </BlueprintLayout>
  );
}
