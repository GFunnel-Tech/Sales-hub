import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SalesNavigation } from "@/components/SalesNavigation";
import { ScriptDisplay } from "@/components/sales/ScriptDisplay";
import { ObjectionTracker, type Objection } from "@/components/sales/ObjectionTracker";
import { EnhancedHintsTips } from "@/components/sales/EnhancedHintsTips";
import { PhaseDisposition, type DispositionData } from "@/components/sales/PhaseDisposition";
import { SALES_SCRIPT_CONTENT, PHASE_ORDER, getPhaseByIndex } from "@/lib/salesScriptContent";
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
  const [state, setState] = useState<SalesProcessState>(initialState);
  const [isSaving, setIsSaving] = useState(false);

  const currentPhaseConfig = getPhaseByIndex(state.currentPhase);
  const totalPhases = PHASE_ORDER.length;
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 500);
    return () => clearTimeout(timeout);
  }, [state]);

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
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
  };

  const handleDispositionChange = (disposition: DispositionData) => {
    const phaseId = PHASE_ORDER[state.currentPhase];
    setState((prev) => ({
      ...prev,
      phaseDispositions: { ...prev.phaseDispositions, [phaseId]: disposition },
    }));
  };

  const handleObjectionsChange = (objections: Objection[]) => {
    setState((prev) => ({ ...prev, objections }));
  };

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

  const renderField = (field: typeof currentPhaseConfig.fields[0]) => {
    const value = getCurrentFieldValue(field.id);
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
            <Input id={field.id} placeholder={field.placeholder} value={typeof value === "string" ? value : ""} onChange={(e) => handleFieldChange(field.id, e.target.value)} />
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea id={field.id} placeholder={field.placeholder} value={typeof value === "string" ? value : ""} onChange={(e) => handleFieldChange(field.id, e.target.value)} className="min-h-[80px]" />
          </div>
        );
      case "yesno":
        return (
          <div key={field.id} className="flex items-center justify-between py-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Switch id={field.id} checked={Boolean(value)} onCheckedChange={(checked) => handleFieldChange(field.id, checked)} />
          </div>
        );
      case "select":
        return (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select value={typeof value === "string" ? value : ""} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{field.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

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
              <span className="font-medium">Phase {state.currentPhase + 1} of {totalPhases}</span>
              <span className="text-muted-foreground">{state.completedPhases.length} completed</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex gap-1 mt-2">
              {PHASE_ORDER.map((phaseId, idx) => (
                <button key={phaseId} onClick={() => setState((prev) => ({ ...prev, currentPhase: idx }))} className={`flex-1 h-1.5 rounded-full transition-colors ${idx === state.currentPhase ? "bg-primary" : state.completedPhases.includes(idx) ? "bg-green-500" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        </div>

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
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Script</CardTitle></CardHeader>
              <CardContent><ScriptDisplay blocks={currentPhaseConfig.scriptBlocks} prospectName={state.prospectName || "[NAME]"} /></CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Capture Notes</CardTitle></CardHeader>
              <CardContent className="space-y-4">{currentPhaseConfig.fields.map(renderField)}</CardContent>
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
