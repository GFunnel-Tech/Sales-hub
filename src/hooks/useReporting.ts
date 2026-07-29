import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// The reporting views/tables are created by the GHL reporting migration and are
// not in the generated Supabase types, so we read them through an untyped client.
const db = supabase as any;

export interface AccountHealthRow {
  account_id: string;
  client_name: string | null;
  currency: string;
  local_day: string;
  delivered_leads: number;
  contacts_dialed: number;
  dials: number;
  appointments_set: number;
  status: "complete" | "no_leads_delivered" | "leads_not_worked" | "worked_no_appointments";
  complete: boolean;
  completion_rate: number;
}

export interface SetterDailyRow {
  account_id: string;
  client_name: string | null;
  account_currency: string;
  setter_id: string | null;
  setter_name: string | null;
  local_day: string;
  dials: number;
  connects: number;
  conversations: number;
  contact_rate: number | null;
  working_set: number;
  calls_le15s: number;
}

export interface AccountAlert {
  id: string;
  account_id: string;
  day: string;
  type: string;
  status: string | null;
  severity: "info" | "warning" | "critical";
  owner: string | null;
  message: string;
  value: number | null;
  resolved: boolean;
  created_at: string;
}

/** Distinct local_days present in the health view, newest first. */
export function useReportingDays() {
  return useQuery({
    queryKey: ["reporting-days"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await db
        .from("v_account_health")
        .select("local_day")
        .order("local_day", { ascending: false })
        .limit(400);
      if (error) throw error;
      return [...new Set((data ?? []).map((r: any) => r.local_day))] as string[];
    },
  });
}

export function useAccountHealth(day: string | undefined) {
  return useQuery({
    enabled: !!day,
    queryKey: ["account-health", day],
    queryFn: async (): Promise<AccountHealthRow[]> => {
      const { data, error } = await db
        .from("v_account_health")
        .select("*")
        .eq("local_day", day)
        .order("client_name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSetterDaily(day: string | undefined) {
  return useQuery({
    enabled: !!day,
    queryKey: ["setter-daily", day],
    queryFn: async (): Promise<SetterDailyRow[]> => {
      const { data, error } = await db
        .from("v_setter_daily")
        .select("*")
        .eq("local_day", day)
        .order("dials", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useOpenAlerts() {
  return useQuery({
    queryKey: ["account-alerts-open"],
    queryFn: async (): Promise<AccountAlert[]> => {
      const { data, error } = await db
        .from("account_alerts")
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}
