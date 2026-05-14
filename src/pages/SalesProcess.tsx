import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SalesNavigation } from "@/components/SalesNavigation";
import { ScriptDisplay } from "@/components/sales/ScriptDisplay";
import { ObjectionTracker, type Objection } from "@/components/sales/ObjectionTracker";
import { EnhancedHintsTips } from "@/components/sales/EnhancedHintsTips";
import { PhaseDisposition, type DispositionData } from "@/components/sales/PhaseDisposition";
import { LeadLookup } from "@/components/sales/LeadLookup";
import { useSalesPhases } from "@/hooks/useSalesPhases";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Save, 
  Video,
  FileText,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "sales_process_data";

interface SalesProcessState {
  prospectName: string;
  companyName: string;
  formData: Record<string, Record<string, string | boolean>>;
  objections: Objection[];
  phaseDispositions: Record<string, DispositionData>;
  completedPhases: number[];
  currentPhase: number;
}

const initialState: SalesProcessState = {
  prospectName: "",
  companyName: "",
  formData: {},
  objections: [],
  phaseDispositions: {},
  completedPhases: [],
  currentPhase: 0,
};

export default function SalesProcess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { phases } = useSalesPhases();
  const [state, setState] = useState<SalesProcessState>(initialState);
  const [isSaving, setIsSaving] = useState(false);

  const PHASE_ORDER = phases.map((p) => p.id);
  const getPhaseByIndex = (i: number) => phases[i] ?? null;
  const currentPhaseConfig = getPhaseByIndex(state.currentPhase);
  const totalPhases = PHASE_ORDER.length || 1;
  const progress = ((state.currentPhase + 1) / totalPhases) * 100;

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, []);

  // Increased debounce for better performance
  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 1500);
    return () => clearTimeout(timeout);
  }, [state]);

  const handleFieldChange = useCallback((fieldId: string, value: string | boolean) => {
    const phaseId = PHASE_ORDER[state.currentPhase];
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [phaseId]: { ...prev.formData[phaseId], [fieldId]: value },
      },
      ...(fieldId === "prospectName" && typeof value === "string" ? { prospectName: value } : {}),
      ...(fieldId === "companyName" && typeof value === "string" ? { companyName: value } : {}),
    }));
  }, [state.currentPhase]);

  const handleDispositionChange = useCallback((disposition: DispositionData) => {
    const phaseId = PHASE_ORDER[state.currentPhase];
    setState((prev) => ({
      ...prev,
      phaseDispositions: { ...prev.phaseDispositions, [phaseId]: disposition },
    }));
  }, [state.currentPhase]);

  const handleObjectionsChange = useCallback((objections: Objection[]) => {
    setState((prev) => ({ ...prev, objections }));
  }, []);

  const handleSelectLead = useCallback((lead: { prospectName: string; companyName?: string; email?: string }) => {
    setState((prev) => ({
      ...prev,
      prospectName: lead.prospectName,
      companyName: lead.companyName || '',
      formData: {
        ...prev.formData,
        handshake_authority: {
          ...prev.formData.handshake_authority,
          prospectName: lead.prospectName,
          companyName: lead.companyName || '',
        },
      },
    }));
  }, []);

  const handleClearLead = useCallback(() => {
    setState(initialState);
  }, []);

  const getCurrentDisposition = (): DispositionData => {
    const phaseId = PHASE_ORDER[state.currentPhase];
    return state.phaseDispositions[phaseId] || { confidenceLevel: 0, status: '', notes: '' };
  };

  const getCurrentFieldValue = (fieldId: string): string | boolean => {
    const phaseId = PHASE_ORDER[state.currentPhase];
    return state.formData[phaseId]?.[fieldId] ?? "";
  };

  const handleMarkComplete = () => {
    if (!state.completedPhases.includes(state.currentPhase)) {
      setState((prev) => ({
        ...prev,
        completedPhases: [...prev.completedPhases, state.currentPhase],
      }));
    }
  };

  const handleNext = () => {
    handleMarkComplete();
    if (state.currentPhase < totalPhases - 1) {
      setState((prev) => ({ ...prev, currentPhase: prev.currentPhase + 1 }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (state.currentPhase > 0) {
      setState((prev) => ({ ...prev, currentPhase: prev.currentPhase - 1 }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast({ title: "Progress Saved", description: "Your sales call data has been saved." });
  };

  const handleReset = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    toast({ title: "Session Reset", description: "Starting fresh." });
  };

  if (!currentPhaseConfig) return <div>Error: Phase not found</div>;

  // Get all field values for current phase
  const currentPhaseId = PHASE_ORDER[state.currentPhase];
  const currentFieldValues = state.formData[currentPhaseId] || {};

  return (
    <div className="min-h-screen bg-background">
      <SalesNavigation />
      <main className="container py-6 max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Live Sales Call</h1>
              <p className="text-muted-foreground">{state.prospectName || "New Prospect"} {state.companyName && `• ${state.companyName}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 mr-2" />{isSaving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Sales Pipeline — Phase {state.currentPhase + 1} of {totalPhases}</span>
              <span className="text-muted-foreground">{state.completedPhases.length} completed</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {PHASE_ORDER.map((phaseId, idx) => {
                const phase = getPhaseByIndex(idx);
                const isCurrent = idx === state.currentPhase;
                const isCompleted = state.completedPhases.includes(idx);
                return (
                  <HoverCard key={phaseId} openDelay={120} closeDelay={80}>
                    <HoverCardTrigger asChild>
                      <button
                        onClick={() => setState((prev) => ({ ...prev, currentPhase: idx }))}
                        className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCompleted
                            ? "border-green-500/40 bg-green-500/10 text-green-700 hover:border-green-500/60"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                        aria-label={`Step ${idx + 1}: ${phase.title}`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-[10px] font-bold">
                          {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                        </span>
                        <span>Step {idx + 1}</span>
                        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />}
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72" side="bottom" align="start">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Step {idx + 1} of {totalPhases}
                          </span>
                          {isCompleted && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-green-500/40 text-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold">{phase.title}</h4>
                        {phase.subtitle && (
                          <p className="text-xs text-muted-foreground leading-relaxed">{phase.subtitle}</p>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lead Lookup */}
        <LeadLookup 
          onSelectLead={handleSelectLead} 
          onClear={handleClearLead} 
        />

        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Phase {state.currentPhase + 1}</Badge>
                  {state.completedPhases.includes(state.currentPhase) && <Badge className="bg-green-500/10 text-green-600 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>}
                </div>
                <CardTitle className="text-xl">{currentPhaseConfig.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{currentPhaseConfig.subtitle}</p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Script & Capture</CardTitle></CardHeader>
              <CardContent>
                <ScriptDisplay 
                  blocks={currentPhaseConfig.scriptBlocks} 
                  prospectName={state.prospectName || "[NAME]"} 
                  fieldValues={currentFieldValues}
                  onFieldChange={handleFieldChange}
                />
              </CardContent>
            </Card>

            <PhaseDisposition value={getCurrentDisposition()} onChange={handleDispositionChange} />

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={state.currentPhase === 0}><ArrowLeft className="h-4 w-4 mr-2" />Previous</Button>
              <Button onClick={handleMarkComplete} variant="secondary"><CheckCircle2 className="h-4 w-4 mr-2" />Mark Complete</Button>
              <Button onClick={handleNext} disabled={state.currentPhase === totalPhases - 1}>Next<ArrowRight className="h-4 w-4 ml-2" /></Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card><CardContent className="pt-4"><EnhancedHintsTips hints={currentPhaseConfig.hints} /></CardContent></Card>
            <ObjectionTracker phaseId={PHASE_ORDER[state.currentPhase]} objections={state.objections} onObjectionsChange={handleObjectionsChange} />
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" asChild><a href="https://meet.google.com" target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4" />Start Video Call</a></Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/log-sale")}><FileText className="h-4 w-4" />Log Sale</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/blueprint/handshake")}><Sparkles className="h-4 w-4" />Start Blueprint Session</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
