import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  Circle,
  Video,
  ExternalLink,
  Lightbulb,
  Save,
  Loader2
} from "lucide-react";

interface StepFormData {
  [key: string]: string | boolean;
}

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

// Form configuration for each stage type
const stageFormConfig: Record<string, { fields: { id: string; label: string; type: "text" | "textarea" | "yesno"; placeholder?: string }[] }> = {
  handshake_authority: {
    fields: [
      { id: "prospect_name", label: "Prospect Name", type: "text", placeholder: "Enter prospect's full name" },
      { id: "company_name", label: "Company Name", type: "text", placeholder: "Enter company name" },
      { id: "initial_rapport", label: "Initial Rapport Notes", type: "textarea", placeholder: "How did the introduction go? Any personal notes..." },
      { id: "expectations_set", label: "Did you set expectations for the call?", type: "yesno" },
    ]
  },
  dream_pain_bridge: {
    fields: [
      { id: "dream_state", label: "What's their dream/ideal outcome?", type: "textarea", placeholder: "What would their ideal business look like in 12 months?" },
      { id: "main_pain", label: "What's their biggest pain point?", type: "textarea", placeholder: "What's the biggest bottleneck or frustration they're facing?" },
      { id: "cost_of_pain", label: "What has this problem cost them?", type: "textarea", placeholder: "Time, money, opportunities lost..." },
      { id: "tried_before", label: "What have they tried before?", type: "textarea", placeholder: "Previous solutions that didn't work..." },
    ]
  },
  discovery: {
    fields: [
      { id: "current_process", label: "How do they currently handle this?", type: "textarea", placeholder: "Current tools, processes, workflows..." },
      { id: "team_size", label: "Team size / decision makers", type: "text", placeholder: "How many people involved?" },
      { id: "timeline", label: "What's their timeline to solve this?", type: "text", placeholder: "When do they need a solution?" },
      { id: "budget_range", label: "Budget expectations", type: "text", placeholder: "Any budget mentioned?" },
    ]
  },
  presentation: {
    fields: [
      { id: "solution_presented", label: "Which solution/package did you present?", type: "text", placeholder: "Software / Services / Support" },
      { id: "key_features_highlighted", label: "Key features that resonated", type: "textarea", placeholder: "Which features got them excited?" },
      { id: "understanding_confirmed", label: "Did they confirm understanding?", type: "yesno" },
      { id: "presentation_notes", label: "Presentation notes", type: "textarea", placeholder: "Any reactions, questions, or concerns during presentation..." },
    ]
  },
  ask_objections: {
    fields: [
      { id: "main_objection", label: "Main objection raised", type: "textarea", placeholder: "What was their primary concern?" },
      { id: "objection_type", label: "Objection category", type: "text", placeholder: "Price / Timing / Authority / Trust / Need" },
      { id: "how_handled", label: "How did you handle it?", type: "textarea", placeholder: "What approach did you use? (Isolate → Accept → Create → Expand)" },
      { id: "objection_resolved", label: "Was the objection resolved?", type: "yesno" },
    ]
  },
  ask_order: {
    fields: [
      { id: "close_attempted", label: "Did you ask for the order?", type: "yesno" },
      { id: "response", label: "What was their response?", type: "textarea", placeholder: "Yes / No / Need more time..." },
      { id: "commitment_made", label: "What commitment did they make?", type: "textarea", placeholder: "Payment, follow-up call, trial, etc." },
      { id: "next_steps", label: "Agreed next steps", type: "textarea", placeholder: "What happens next?" },
    ]
  },
  handoff: {
    fields: [
      { id: "handoff_completed", label: "Was the handoff completed?", type: "yesno" },
      { id: "fulfillment_contact", label: "Fulfillment contact assigned", type: "text", placeholder: "Who will handle onboarding?" },
      { id: "customer_email", label: "Customer email collected", type: "text", placeholder: "Email address" },
      { id: "payment_collected", label: "Payment collected?", type: "yesno" },
      { id: "handoff_notes", label: "Handoff notes for fulfillment", type: "textarea", placeholder: "Important context for the fulfillment team..." },
    ]
  },
};

export default function SalesProcess() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<number, StepFormData>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDefaultScript();
    loadSavedFormData();
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

  const loadSavedFormData = () => {
    const saved = sessionStorage.getItem("salesProcessFormData");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved form data:", e);
      }
    }
  };

  const saveFormData = () => {
    setIsSaving(true);
    sessionStorage.setItem("salesProcessFormData", JSON.stringify(formData));
    setTimeout(() => setIsSaving(false), 500);
  };

  const stages = script?.content || [];
  const currentStage = stages[currentStep];
  const totalSteps = stages.length;

  const currentFormConfig = currentStage ? stageFormConfig[currentStage.stage] : null;
  const currentStepData = formData[currentStep] || {};

  const updateField = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        [fieldId]: value
      }
    }));
  };

  const goToNext = () => {
    if (currentStep < totalSteps - 1) {
      saveFormData();
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      saveFormData();
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    saveFormData();
    setCurrentStep(index);
  };

  const markComplete = () => {
    saveFormData();
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const resetProcess = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setFormData({});
    sessionStorage.removeItem("salesProcessFormData");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <SalesNavigation />
        <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading sales process...
          </div>
        </main>
      </div>
    );
  }

  if (!script || stages.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30">
        <SalesNavigation />
        <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No sales script available yet.</p>
              <Button asChild>
                <Link to="/scripts">Browse Scripts</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Sales Process</h1>
            <p className="text-muted-foreground">{script.title} - Fill in as you guide the call</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={saveFormData}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Progress
            </Button>
            <Button variant="outline" asChild>
              <a 
                href="https://meet.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Google Meet
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
                  Fill in the details as you guide the conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Form Fields */}
                <div className="space-y-6">
                  {currentFormConfig?.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-base font-medium">
                        {field.label}
                      </Label>
                      
                      {field.type === "text" && (
                        <Input
                          id={field.id}
                          placeholder={field.placeholder}
                          value={(currentStepData[field.id] as string) || ""}
                          onChange={(e) => updateField(field.id, e.target.value)}
                        />
                      )}
                      
                      {field.type === "textarea" && (
                        <Textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          value={(currentStepData[field.id] as string) || ""}
                          onChange={(e) => updateField(field.id, e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                      )}
                      
                      {field.type === "yesno" && (
                        <RadioGroup
                          value={currentStepData[field.id] === true ? "yes" : currentStepData[field.id] === false ? "no" : ""}
                          onValueChange={(value) => updateField(field.id, value === "yes")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id={`${field.id}-yes`} />
                            <Label htmlFor={`${field.id}-yes`} className="font-normal cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id={`${field.id}-no`} />
                            <Label htmlFor={`${field.id}-no`} className="font-normal cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  ))}

                  {!currentFormConfig && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Talking points for this stage:</p>
                      <ul className="space-y-2">
                        {currentStage.prompts.map((prompt, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span>{prompt}</span>
                          </li>
                        ))}
                      </ul>
                      <Textarea
                        placeholder="Add your notes for this stage..."
                        value={(currentStepData["notes"] as string) || ""}
                        onChange={(e) => updateField("notes", e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}
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
                        <Link to="/log-sale">Log This Sale</Link>
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

            {/* Talking Points Reference */}
            {currentFormConfig && currentStage.prompts.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Talking Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {currentStage.prompts.map((prompt, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-medium">{index + 1}.</span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

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
                  <Link to="/log-sale">
                    Log Sale / Activity
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/blueprint">
                    Start Blueprint Session
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
