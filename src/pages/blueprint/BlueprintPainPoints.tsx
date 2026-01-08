import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { PAIN_POINT_QUESTIONS } from "@/lib/blueprintConfig";
import { ArrowRight, AlertTriangle, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlueprintPainPoints() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>(
    session.painPointResponses.length > 0 
      ? session.painPointResponses 
      : Array(PAIN_POINT_QUESTIONS.length).fill("")
  );

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(3);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < PAIN_POINT_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      updateSession({ painPointResponses: responses });
      navigate("/blueprint/bridge");
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const isLastQuestion = currentQuestion === PAIN_POINT_QUESTIONS.length - 1;
  const currentResponse = responses[currentQuestion];
  const charCount = currentResponse.length;

  return (
    <BlueprintLayout
      title="Pain Points"
      subtitle="Understanding your current challenges"
      currentPage={3}
      backPath="/blueprint/dream-state"
    >
      {/* Question Progress */}
      <div className="flex justify-center gap-2 mb-8">
        {PAIN_POINT_QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentQuestion
                ? "bg-amber-500 scale-125"
                : index < currentQuestion
                ? "bg-amber-500/50"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <Card className="border-amber-500/20">
        <CardContent className="p-6">
          {/* Question Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-amber-500/10">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          {/* Question */}
          <p className="text-lg font-medium text-center mb-6">
            {PAIN_POINT_QUESTIONS[currentQuestion]}
          </p>

          {/* Response */}
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the challenges..."
              value={currentResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>The more detail, the better we can help</span>
              <span>{charCount}/2000</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSkip}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
              <Button onClick={handleNext}>
                {isLastQuestion ? "Continue" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-amber-600">Tip:</strong> Pain determines price. 
          The deeper you understand their frustration, the more valuable your solution becomes.
        </p>
      </div>
    </BlueprintLayout>
  );
}
