import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { ScriptDisplay } from "@/components/sales/ScriptDisplay";
import { ObjectionTracker, type Objection } from "@/components/sales/ObjectionTracker";
import { EnhancedHintsTips } from "@/components/sales/EnhancedHintsTips";
import { PhaseDisposition, type DispositionData } from "@/components/sales/PhaseDisposition";
import { PhaseActionBar } from "@/components/sales/PhaseActionBar";
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
import { getPhaseAccent } from "@/lib/phaseAccents";

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

  if (!currentPhaseConfig) {
    return (
      <div className="min-h-screen bg-background">
        <SalesHubNavigation />
        <div className="container py-12 text-center text-muted-foreground">Loading sales phases…</div>
      </div>
    );
  }

  // Get all field values for current phase
  const currentPhaseId = PHASE_ORDER[state.currentPhase];
  const currentFieldValues = state.formData[currentPhaseId] || {};

  const currentAccent = getPhaseAccent(state.currentPhase);

  return (
    <div className="min-h-screen bg-background">
      <SalesHubNavigation />
      <main className="container py-8 md:py-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Editorial header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                Live Sales Call
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground">
                {state.prospectName || "New Prospect"}
                {state.companyName && (
                  <span className="text-muted-foreground font-normal italic"> · {state.companyName}</span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="rounded-full">
                <Save className="h-4 w-4 mr-2" />{isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* Progress meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-semibold tracking-wider uppercase">
              Step {state.currentPhase + 1} <span className="text-foreground/40">/</span> {totalPhases}
            </span>
            <span>{state.completedPhases.length} completed</span>
          </div>

          {/* Segmented phase rail */}
          <div className="flex items-center gap-1.5 mb-5">
            {PHASE_ORDER.map((_, idx) => {
              const acc = getPhaseAccent(idx);
              const isCurrent = idx === state.currentPhase;
              const isCompleted = state.completedPhases.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => setState((prev) => ({ ...prev, currentPhase: idx }))}
                  aria-label={`Go to step ${idx + 1}`}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    isCurrent ? `${acc.dot} ring-2 ring-offset-2 ring-offset-background ${acc.ring}`
                    : isCompleted ? acc.dot + " opacity-80"
                    : "bg-muted hover:bg-muted-foreground/30"
                  }`}
                />
              );
            })}
          </div>

          {/* Phase chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {PHASE_ORDER.map((phaseId, idx) => {
              const phase = getPhaseByIndex(idx);
              const acc = getPhaseAccent(idx);
              const isCurrent = idx === state.currentPhase;
              const isCompleted = state.completedPhases.includes(idx);
              return (
                <HoverCard key={phaseId} openDelay={120} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, currentPhase: idx }))}
                      className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isCurrent
                          ? `border-foreground bg-foreground text-background shadow-sm`
                          : isCompleted
                          ? `border-transparent ${acc.surface} ${acc.text}`
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "bg-background" : acc.dot}`} />
                      <span className="tabular-nums opacity-70">{idx + 1}</span>
                      <span className="hidden sm:inline">{phase.title}</span>
                      {isCompleted && !isCurrent && <CheckCircle2 className="h-3 w-3" />}
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

        {/* Lead Lookup */}
        <LeadLookup 
          onSelectLead={handleSelectLead} 
          onClear={handleClearLead} 
        />

        <div className="grid lg:grid-cols-[1fr,360px] gap-6 items-start">
          <div className="space-y-6">
            <div className={`relative rounded-2xl border bg-card overflow-hidden`}>
              <div className={`absolute top-0 left-0 right-0 h-1 ${currentAccent.dot}`} />
              <div className="px-6 py-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase ${currentAccent.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${currentAccent.dot}`} />
                    Phase {state.currentPhase + 1}
                  </span>
                  {state.completedPhases.includes(state.currentPhase) && (
                    <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3 mr-1" />Completed
                    </Badge>
                  )}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{currentPhaseConfig.title}</h2>
                {currentPhaseConfig.subtitle && (
                  <p className="text-muted-foreground text-sm md:text-base mt-2 leading-relaxed max-w-2xl">{currentPhaseConfig.subtitle}</p>
                )}
              </div>
            </div>

            <ScriptDisplay 
              blocks={currentPhaseConfig.scriptBlocks} 
              prospectName={state.prospectName || "[NAME]"} 
              fieldValues={currentFieldValues}
              onFieldChange={handleFieldChange}
            />

            <PhaseDisposition value={getCurrentDisposition()} onChange={handleDispositionChange} />

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handlePrevious} disabled={state.currentPhase === 0} className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />Previous
              </Button>
              <Button onClick={handleMarkComplete} variant="outline" className="rounded-full">
                <CheckCircle2 className="h-4 w-4 mr-2" />Mark Complete
              </Button>
              <Button onClick={handleNext} disabled={state.currentPhase === totalPhases - 1} className="rounded-full px-6">
                Next<ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto space-y-4 pr-1 -mr-1 [scrollbar-width:thin]">
            <Card><CardContent className="pt-4"><EnhancedHintsTips hints={currentPhaseConfig.hints} /></CardContent></Card>
            <ObjectionTracker phaseId={PHASE_ORDER[state.currentPhase]} objections={state.objections} onObjectionsChange={handleObjectionsChange} />
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" asChild><a href="https://meet.google.com" target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4" />Start Video Call</a></Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/log-sale")}><FileText className="h-4 w-4" />Log Sale / Intake</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/documents")}><FileText className="h-4 w-4" />Agreement & Disclosure</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/blueprint/handshake")}><Sparkles className="h-4 w-4" />Start Blueprint Session</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
