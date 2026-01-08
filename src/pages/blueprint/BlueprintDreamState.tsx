import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { DREAM_STATE_QUESTIONS } from "@/lib/blueprintConfig";
import { ArrowRight, Sparkles, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlueprintDreamState() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>(
    session.dreamStateResponses.length > 0 
      ? session.dreamStateResponses 
      : Array(DREAM_STATE_QUESTIONS.length).fill("")
  );

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(2);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < DREAM_STATE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Save and navigate to next page
      updateSession({ dreamStateResponses: responses });
      navigate("/blueprint/pain-points");
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

  const isLastQuestion = currentQuestion === DREAM_STATE_QUESTIONS.length - 1;
  const currentResponse = responses[currentQuestion];
  const charCount = currentResponse.length;

  return (
    <BlueprintLayout
      title="Dream State"
      subtitle="Let's explore your ideal future"
      currentPage={2}
      backPath="/blueprint"
    >
      {/* Question Progress */}
      <div className="flex justify-center gap-2 mb-8">
        {DREAM_STATE_QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentQuestion
                ? "bg-primary scale-125"
                : index < currentQuestion
                ? "bg-primary/50"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          {/* Question Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Question */}
          <p className="text-lg font-medium text-center mb-6">
            {DREAM_STATE_QUESTIONS[currentQuestion]}
          </p>

          {/* Response */}
          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts..."
              value={currentResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Take your time to answer thoughtfully</span>
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
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> Listen actively and let them paint the picture. 
          The more detailed their dream, the easier it is to show how you can help.
        </p>
      </div>
    </BlueprintLayout>
  );
}
