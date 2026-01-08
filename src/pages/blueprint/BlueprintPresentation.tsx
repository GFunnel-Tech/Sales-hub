import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { ArrowRight, FileText, Wand2, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function BlueprintPresentation() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scope, setScope] = useState(session.generatedScope || "");
  const [hasGenerated, setHasGenerated] = useState(!!session.generatedScope);

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(7);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const generateScope = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (will be replaced with actual edge function)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const generatedText = `# ${session.prospectCompany || session.prospectName} - Technical Scope

## Executive Summary
Based on our discovery session, we've identified key opportunities to transform your business operations through an integrated platform approach.

## Current Challenges
${session.painPointResponses.map((p, i) => `${i + 1}. ${p || "Not specified"}`).join("\n")}

## Desired Outcomes
${session.dreamStateResponses.map((d, i) => `${i + 1}. ${d || "Not specified"}`).join("\n")}

## Recommended Solution
We recommend implementing GFunnel's comprehensive platform including:

### Phase 1: Foundation (Week 1-2)
- Lead Connector CRM setup and configuration
- Contact import and data migration
- Basic automation workflows

### Phase 2: Automation (Week 3-4)
- Flows AI implementation
- Email and SMS sequences
- Lead scoring and routing

### Phase 3: Optimization (Week 5-6)
- Analytics and reporting
- Performance optimization
- Team training and handoff

## Investment
See pricing options on the next page.

## Next Steps
1. Select your preferred package
2. Complete onboarding documentation
3. Schedule kickoff call
`;

    setScope(generatedText);
    setHasGenerated(true);
    updateSession({ generatedScope: generatedText });
    setIsGenerating(false);
  };

  const handleContinue = () => {
    updateSession({ generatedScope: scope });
    navigate("/blueprint/pricing");
  };

  return (
    <BlueprintLayout
      title="Presentation"
      subtitle="Generate and present the custom scope"
      currentPage={7}
      backPath="/blueprint/discovery"
    >
      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className={hasGenerated ? "border-green-500/50 bg-green-500/5" : ""}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {hasGenerated ? (
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
              ) : (
                <Wand2 className="h-10 w-10 text-primary mb-3" />
              )}
              <h3 className="font-semibold mb-2">
                {hasGenerated ? "Scope Generated" : "Generate Scope"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {hasGenerated 
                  ? "AI-generated scope based on discovery" 
                  : "AI will create a custom scope based on your discovery"}
              </p>
              <Button 
                onClick={generateScope} 
                disabled={isGenerating}
                variant={hasGenerated ? "outline" : "default"}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : hasGenerated ? (
                  "Regenerate"
                ) : (
                  "Generate Scope"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-2">Build Prototype</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a visual prototype to showcase the solution
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scope Preview */}
      {hasGenerated && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Scope
            </h3>
            <Textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can edit the scope before presenting to the prospect.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <Button 
        onClick={handleContinue} 
        className="w-full" 
        size="lg"
        disabled={!hasGenerated}
      >
        Continue to Pricing
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Tip */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> Review the generated scope with the prospect. 
          Ask "Does this capture what we discussed?" to confirm understanding before pricing.
        </p>
      </div>
    </BlueprintLayout>
  );
}
