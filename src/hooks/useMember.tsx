import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Member {
  id: string;
  member_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  audience: string | null;
}

interface MemberContextType {
  member: Member | null;
  loading: boolean;
  lookupMember: (memberId: string) => Promise<{ error: string | null }>;
  clearMember: () => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const MEMBER_STORAGE_KEY = 'sales_hub_member';

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored member on mount
  useEffect(() => {
    const storedMemberId = sessionStorage.getItem(MEMBER_STORAGE_KEY);
    if (storedMemberId) {
      lookupMember(storedMemberId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const lookupMember = async (memberId: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, member_id, full_name, email, phone, avatar_url, is_active, audience")
        .eq("member_id", memberId.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Member lookup error:", error);
        return { error: "Unable to verify member ID. Please try again." };
      }

      if (!data) {
        return { error: "Member ID not found. Please check your ID and try again." };
      }

      if (!data.is_active) {
        return { error: "This member ID is no longer active. Please contact your administrator." };
      }

      setMember(data as Member);
      sessionStorage.setItem(MEMBER_STORAGE_KEY, memberId.toUpperCase().trim());
      return { error: null };
    } catch (err) {
      console.error("Member lookup exception:", err);
      return { error: "An unexpected error occurred. Please try again." };
    }
  };

  const clearMember = () => {
    setMember(null);
    sessionStorage.removeItem(MEMBER_STORAGE_KEY);
  };

  return (
    <MemberContext.Provider value={{ member, loading, lookupMember, clearMember }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
}
