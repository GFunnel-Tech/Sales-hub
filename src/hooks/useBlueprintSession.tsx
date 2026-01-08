import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import { useToast } from "@/hooks/use-toast";

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
  startSession: (prospectData: Partial<BlueprintSessionData>) => Promise<void>;
  updateSession: (data: Partial<BlueprintSessionData>) => void;
  saveSession: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  completeSession: () => Promise<void>;
  resetSession: () => void;
  hasActiveSession: boolean;
}

const BlueprintContext = createContext<BlueprintContextType | null>(null);

export function BlueprintProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<BlueprintSessionData>(initialSessionData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { member } = useMember();
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Auto-save with debounce
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (session.sessionId) {
        saveSession();
      }
    }, 3000);
  }, [session.sessionId]);

  const generateSessionId = () => {
    return `BP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const startSession = async (prospectData: Partial<BlueprintSessionData>) => {
    setIsLoading(true);
    try {
      const sessionId = generateSessionId();
      const newSession: BlueprintSessionData = {
        ...initialSessionData,
        ...prospectData,
        sessionId,
        agentProfileId: member?.id,
        currentPage: 2,
      };

      // Save to database
      const { error } = await supabase.from("blueprint_sessions").insert({
        session_id: sessionId,
        agent_profile_id: member?.id,
        prospect_name: newSession.prospectName,
        prospect_email: newSession.prospectEmail,
        prospect_company: newSession.prospectCompany,
        prospect_industry: newSession.prospectIndustry,
        current_page: 2,
        status: "in_progress",
      });

      if (error) throw error;

      setSession(newSession);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to start session:", error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = (data: Partial<BlueprintSessionData>) => {
    setSession((prev) => ({ ...prev, ...data }));
    triggerAutoSave();
  };

  const saveSession = async () => {
    if (!session.sessionId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("blueprint_sessions")
        .update({
          prospect_name: session.prospectName,
          prospect_email: session.prospectEmail,
          prospect_company: session.prospectCompany,
          prospect_industry: session.prospectIndustry,
          dream_state_responses: session.dreamStateResponses,
          pain_point_responses: session.painPointResponses,
          bridge_understanding: session.bridgeUnderstanding,
          qualification_answers: session.qualificationAnswers,
          qualification_score: session.qualificationScore,
          is_qualified: session.isQualified,
          canvas_image_url: session.canvasImageUrl,
          canvas_json: session.canvasJson as null,
          canvas_notes: session.canvasNotes,
          generated_scope: session.generatedScope,
          scope_url: session.scopeUrl,
          prototype_url: session.prototypeUrl,
          selected_plan: session.selectedPlan,
          custom_request: session.customRequest,
          recording_url: session.recordingUrl,
          agent_notes: session.agentNotes,
          disposition: session.disposition,
          follow_up_date: session.followUpDate || null,
          current_page: session.currentPage,
          status: session.status,
        })
        .eq("session_id", session.sessionId);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const setCurrentPage = (page: number) => {
    setSession((prev) => ({ ...prev, currentPage: page }));
    triggerAutoSave();
  };

  const completeSession = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("blueprint_sessions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          disposition: session.disposition,
          agent_notes: session.agentNotes,
          recording_url: session.recordingUrl,
          follow_up_date: session.followUpDate || null,
        })
        .eq("session_id", session.sessionId);

      if (error) throw error;

      setSession((prev) => ({ ...prev, status: "completed" }));
      toast({
        title: "Session Completed",
        description: "Blueprint session has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to complete session:", error);
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    sessionStorage.removeItem("blueprintSession");
    setSession(initialSessionData);
    setLastSaved(null);
  };

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
