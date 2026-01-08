import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { QUALIFICATION_QUESTIONS } from "@/lib/blueprintConfig";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlueprintQualification() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: boolean }[]>(
    session.qualificationAnswers.length > 0 
      ? session.qualificationAnswers 
      : []
  );
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(5);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const handleAnswer = (answer: boolean) => {
    const question = QUALIFICATION_QUESTIONS[currentQuestion];
    const newAnswers = [...answers, { questionId: question.id, answer }];
    setAnswers(newAnswers);

    if (currentQuestion < QUALIFICATION_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate score and show results
      const score = newAnswers.filter((a) => a.answer).length;
      const isQualified = score >= 3;
      
      updateSession({
        qualificationAnswers: newAnswers,
        qualificationScore: score,
        isQualified,
      });
      
      setShowResults(true);
    }
  };

  const handleContinue = () => {
    navigate("/blueprint/discovery");
  };

  const handleContinueAnyway = () => {
    navigate("/blueprint/discovery");
  };

  const score = answers.filter((a) => a.answer).length;
  const isQualified = score >= 3;

  if (showResults) {
    return (
      <BlueprintLayout
        title="Qualification Results"
        subtitle="Based on your responses"
        currentPage={5}
        backPath="/blueprint/bridge"
      >
        <Card className={cn(
          "border-2",
          isQualified ? "border-green-500/50 bg-green-500/5" : "border-amber-500/50 bg-amber-500/5"
        )}>
          <CardContent className="p-6 text-center">
            {isQualified ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Great Fit!</h3>
                <p className="text-muted-foreground mb-4">
                  Based on your answers, you're an excellent candidate for our solution.
                </p>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {score}/{QUALIFICATION_QUESTIONS.length}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-amber-500/10">
                    <AlertTriangle className="h-12 w-12 text-amber-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-amber-600 mb-2">Let's Discuss</h3>
                <p className="text-muted-foreground mb-4">
                  Some areas need further exploration before we proceed.
                </p>
                <div className="text-3xl font-bold text-amber-600 mb-4">
                  {score}/{QUALIFICATION_QUESTIONS.length}
                </div>
              </>
            )}

            {/* Answer Summary */}
            <div className="mt-6 space-y-2 text-left">
              {answers.map((answer, index) => (
                <div key={answer.questionId} className="flex items-center gap-2 text-sm">
                  {answer.answer ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-muted-foreground">
                    {QUALIFICATION_QUESTIONS[index].question}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={handleContinue} size="lg" className="w-full">
                {isQualified ? "Continue to Discovery" : "Continue Anyway"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!isQualified && (
                <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                  End Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </BlueprintLayout>
    );
  }

  const question = QUALIFICATION_QUESTIONS[currentQuestion];

  return (
    <BlueprintLayout
      title="Qualification"
      subtitle="Quick check to ensure we're a good fit"
      currentPage={5}
      backPath="/blueprint/bridge"
    >
      {/* Question Progress */}
      <div className="flex justify-center gap-2 mb-8">
        {QUALIFICATION_QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index < currentQuestion
                ? "bg-primary"
                : index === currentQuestion
                ? "bg-primary scale-125"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <Card>
        <CardContent className="p-8">
          <p className="text-sm text-muted-foreground text-center mb-2">
            Question {currentQuestion + 1} of {QUALIFICATION_QUESTIONS.length}
          </p>
          
          <h3 className="text-xl font-semibold text-center mb-8">
            {question.question}
          </h3>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="w-32 h-20 bg-green-500 hover:bg-green-600 text-white text-xl"
              onClick={() => handleAnswer(true)}
            >
              YES
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-32 h-20 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xl"
              onClick={() => handleAnswer(false)}
            >
              NO
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tip */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> These questions help qualify the prospect. 
          3+ YES answers indicate a good fit for your solution.
        </p>
      </div>
    </BlueprintLayout>
  );
}
