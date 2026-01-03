import { useState, useEffect } from "react";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  Circle,
  Video,
  ExternalLink,
  Lightbulb,
  MessageSquare
} from "lucide-react";

interface ScriptStage {
  stage: string;
  title: string;
  prompts: string[];
  tips: string;
}

interface Script {
  id: string;
  title: string;
  description: string;
  content: ScriptStage[];
}

const stageOrder = [
  "handshake_authority",
  "dream_pain_bridge",
  "discovery",
  "presentation",
  "ask_objections",
  "ask_order",
  "handoff"
];

export default function SalesProcess() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDefaultScript();
  }, []);

  const fetchDefaultScript = async () => {
    try {
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const content = Array.isArray(data.content) 
          ? (data.content as unknown as ScriptStage[])
          : [];
        setScript({
          id: data.id,
          title: data.title,
          description: data.description || "",
          content
        });
      }
    } catch (error) {
      console.error("Error fetching script:", error);
    } finally {
      setLoading(false);
    }
  };

  const stages = script?.content || [];
  const currentStage = stages[currentStep];
  const totalSteps = stages.length;

  const goToNext = () => {
    if (currentStep < totalSteps - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const markComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const resetProcess = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <SalesNavigation />
        <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
          <p className="text-muted-foreground">Loading sales process...</p>
        </main>
      </div>
    );
  }

  if (!script || stages.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <SalesNavigation />
        <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No sales script available yet.</p>
              <Button asChild>
                <a href="/scripts">Browse Scripts</a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Sales Process Guide</h1>
            <p className="text-muted-foreground">{script.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <a 
                href="https://meet.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Open Google Meet
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            <Button variant="ghost" onClick={resetProcess}>
              Reset
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {stages.map((stage, index) => (
              <button
                key={stage.stage}
                onClick={() => goToStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : completedSteps.includes(index)
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium whitespace-nowrap">
                  {index + 1}. {stage.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Stage Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="mb-2">
                    Step {currentStep + 1} of {totalSteps}
                  </Badge>
                  {completedSteps.includes(currentStep) && (
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{currentStage.title}</CardTitle>
                <CardDescription>
                  Follow these prompts to guide your conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Talking Points
                    </h3>
                    <ul className="space-y-3">
                      {currentStage.prompts.map((prompt, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-foreground">{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={goToPrevious}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {!completedSteps.includes(currentStep) && (
                      <Button variant="ghost" onClick={markComplete}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    
                    {currentStep < totalSteps - 1 ? (
                      <Button onClick={goToNext}>
                        Next Step
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button asChild>
                        <a href="/log-sale">Log This Sale</a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips Sidebar */}
          <div>
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                  <Lightbulb className="w-5 h-5" />
                  Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-900">{currentStage.tips}</p>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a 
                    href="https://meet.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Video Call
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/log-sale">
                    Log Sale / Activity
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/scripts">
                    View All Scripts
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
