import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { ArrowRight, Lightbulb, CheckCircle2 } from "lucide-react";

const bridgePoints = [
  "GFunnel consolidates your lead capture, CRM, automation, and fulfillment into one platform",
  "Flows AI automates repetitive tasks so you can focus on closing deals",
  "Our done-for-you services get you up and running in 30 days or less",
  "We provide ongoing support and optimization to ensure your success",
];

export default function BlueprintBridge() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const [understanding, setUnderstanding] = useState(session.bridgeUnderstanding || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(4);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const handleContinue = () => {
    if (understanding.trim().length < 50) {
      setError("Please provide at least a brief summary (50+ characters)");
      return;
    }
    updateSession({ bridgeUnderstanding: understanding });
    navigate("/blueprint/qualification");
  };

  return (
    <BlueprintLayout
      title="The Bridge"
      subtitle="How we solve your challenges"
      currentPage={4}
      backPath="/blueprint/pain-points"
    >
      {/* Solution Overview */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center mb-4">
            Here's How GFunnel Transforms Your Business
          </h3>

          <div className="space-y-3">
            {bridgePoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prospect Summary */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Based on what you've shared:</h3>
          
          {session.dreamStateResponses.length > 0 && session.dreamStateResponses[0] && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Your Dream:</p>
              <p className="text-sm italic">"{session.dreamStateResponses[0].slice(0, 150)}..."</p>
            </div>
          )}
          
          {session.painPointResponses.length > 0 && session.painPointResponses[0] && (
            <div>
              <p className="text-sm text-muted-foreground">Your Challenge:</p>
              <p className="text-sm italic">"{session.painPointResponses[0].slice(0, 150)}..."</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Understanding Check */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Understanding Check</h3>
          <p className="text-sm text-muted-foreground mb-4">
            In your own words, what stood out most about how we can help?
          </p>

          <div className="space-y-2">
            <Textarea
              placeholder="Summarize your understanding of the solution..."
              value={understanding}
              onChange={(e) => {
                setUnderstanding(e.target.value);
                setError("");
              }}
              className={`min-h-[100px] resize-none ${error ? "border-destructive" : ""}`}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs">
              <span className={error ? "text-destructive" : "text-muted-foreground"}>
                {error || "Minimum 50 characters"}
              </span>
              <span className="text-muted-foreground">{understanding.length}/1000</span>
            </div>
          </div>

          <Button onClick={handleContinue} className="w-full mt-6" size="lg">
            Continue to Qualification
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Tip */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> This step confirms understanding and builds commitment. 
          If they can articulate the value, they're ready to move forward.
        </p>
      </div>
    </BlueprintLayout>
  );
}
