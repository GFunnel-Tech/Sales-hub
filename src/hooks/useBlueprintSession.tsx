import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { memberApi } from "@/lib/memberApi";

export interface BlueprintSessionData {
  id?: string;
  sessionId: string;
  agentProfileId?: string;
  
  // Page 1: Prospect Info
  prospectName: string;
  prospectEmail: string;
  prospectCompany: string;
  prospectIndustry: string;
  
  // Page 2: Dream State
  dreamStateResponses: string[];
  
  // Page 3: Pain Points
  painPointResponses: string[];
  
  // Page 4: Bridge
  bridgeUnderstanding: string;
  
  // Page 5: Qualification
  qualificationAnswers: { questionId: string; answer: boolean }[];
  qualificationScore: number;
  isQualified: boolean;
  
  // Page 6: Discovery
  canvasImageUrl: string;
  canvasJson: object | null;
  canvasNotes: string;
  
  // Page 7: Presentation
  generatedScope: string;
  scopeUrl: string;
  prototypeUrl: string;
  
  // Page 8: Pricing
  selectedPlan: string;
  customRequest: string;
  
  // Page 9: Completion
  recordingUrl: string;
  agentNotes: string;
  disposition: string;
  followUpDate: string;
  
  // Metadata
  currentPage: number;
  status: "in_progress" | "completed" | "abandoned";
}

const initialSessionData: BlueprintSessionData = {
  sessionId: "",
  prospectName: "",
  prospectEmail: "",
  prospectCompany: "",
  prospectIndustry: "",
  dreamStateResponses: [],
  painPointResponses: [],
  bridgeUnderstanding: "",
  qualificationAnswers: [],
  qualificationScore: 0,
  isQualified: false,
  canvasImageUrl: "",
  canvasJson: null,
  canvasNotes: "",
  generatedScope: "",
  scopeUrl: "",
  prototypeUrl: "",
  selectedPlan: "",
  customRequest: "",
  recordingUrl: "",
  agentNotes: "",
  disposition: "",
  followUpDate: "",
  currentPage: 1,
  status: "in_progress",
};

interface BlueprintContextType {
  session: BlueprintSessionData;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  startSession: (prospectData: Partial<BlueprintSessionData>, profileId?: string) => Promise<void>;
  updateSession: (data: Partial<BlueprintSessionData>) => void;
  saveSession: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  completeSession: () => Promise<void>;
  resetSession: () => void;
  hasActiveSession: boolean;
}

const BlueprintContext = createContext<BlueprintContextType | null>(null);

export function BlueprintProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BlueprintSessionData>(initialSessionData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const hasActiveSession = !!session.sessionId;

  // Load session from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("blueprintSession");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSession(parsed);
      } catch (e) {
        console.error("Failed to parse saved session:", e);
      }
    }
  }, []);

  // Persist to sessionStorage on changes
  useEffect(() => {
    if (session.sessionId) {
      sessionStorage.setItem("blueprintSession", JSON.stringify(session));
    }
  }, [session]);

  const saveSessionToDb = useCallback(async (sessionData: BlueprintSessionData) => {
    if (!sessionData.sessionId) return;
    setIsSaving(true);
    try {
      await memberApi.updateBlueprintSession(sessionData.sessionId, {
        prospect_name: sessionData.prospectName,
        prospect_email: sessionData.prospectEmail,
        prospect_company: sessionData.prospectCompany,
        prospect_industry: sessionData.prospectIndustry,
        dream_state_responses: sessionData.dreamStateResponses,
        pain_point_responses: sessionData.painPointResponses,
        bridge_understanding: sessionData.bridgeUnderstanding,
        qualification_answers: sessionData.qualificationAnswers,
        qualification_score: sessionData.qualificationScore,
        is_qualified: sessionData.isQualified,
        canvas_image_url: sessionData.canvasImageUrl,
        canvas_json: sessionData.canvasJson,
        canvas_notes: sessionData.canvasNotes,
        generated_scope: sessionData.generatedScope,
        scope_url: sessionData.scopeUrl,
        prototype_url: sessionData.prototypeUrl,
        selected_plan: sessionData.selectedPlan,
        custom_request: sessionData.customRequest,
        recording_url: sessionData.recordingUrl,
        agent_notes: sessionData.agentNotes,
        disposition: sessionData.disposition,
        follow_up_date: sessionData.followUpDate || null,
        current_page: sessionData.currentPage,
        status: sessionData.status,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Auto-save with debounce
  const triggerAutoSave = useCallback((sessionData: BlueprintSessionData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (sessionData.sessionId) {
        saveSessionToDb(sessionData);
      }
    }, 3000);
  }, [saveSessionToDb]);

  const generateSessionId = () => {
    return `BP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const startSession = async (prospectData: Partial<BlueprintSessionData>, profileId?: string) => {
    setIsLoading(true);
    try {
      const sessionId = generateSessionId();
      const newSession: BlueprintSessionData = {
        ...initialSessionData,
        ...prospectData,
        sessionId,
        agentProfileId: profileId,
        currentPage: 2,
      };

      // Save to database via secure edge function (member ID validated server-side)
      await memberApi.createBlueprintSession({
        session_id: sessionId,
        prospect_name: newSession.prospectName,
        prospect_email: newSession.prospectEmail,
        prospect_company: newSession.prospectCompany,
        prospect_industry: newSession.prospectIndustry,
        current_page: 2,
      });

      setSession(newSession);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to start session:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = useCallback((data: Partial<BlueprintSessionData>) => {
    setSession((prev) => {
      const updated = { ...prev, ...data };
      triggerAutoSave(updated);
      return updated;
    });
  }, [triggerAutoSave]);

  const saveSession = useCallback(async () => {
    await saveSessionToDb(session);
  }, [session, saveSessionToDb]);

  const setCurrentPage = useCallback((page: number) => {
    setSession((prev) => {
      const updated = { ...prev, currentPage: page };
      triggerAutoSave(updated);
      return updated;
    });
  }, [triggerAutoSave]);

  const completeSession = async () => {
    setIsLoading(true);
    try {
      await memberApi.completeBlueprintSession(session.sessionId, {
        disposition: session.disposition,
        agent_notes: session.agentNotes,
        recording_url: session.recordingUrl,
        follow_up_date: session.followUpDate || null,
      });
      setSession((prev) => ({ ...prev, status: "completed" }));
    } catch (error) {
      console.error("Failed to complete session:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = useCallback(() => {
    sessionStorage.removeItem("blueprintSession");
    setSession(initialSessionData);
    setLastSaved(null);
  }, []);

  return (
    <BlueprintContext.Provider
      value={{
        session,
        isLoading,
        isSaving,
        lastSaved,
        startSession,
        updateSession,
        saveSession,
        setCurrentPage,
        completeSession,
        resetSession,
        hasActiveSession,
      }}
    >
      {children}
    </BlueprintContext.Provider>
  );
}

export function useBlueprintSession() {
  const context = useContext(BlueprintContext);
  if (!context) {
    throw new Error("useBlueprintSession must be used within a BlueprintProvider");
  }
  return context;
}
