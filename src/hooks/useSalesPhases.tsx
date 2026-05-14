import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  SALES_SCRIPT_CONTENT,
  PHASE_ORDER as STATIC_PHASE_ORDER,
  type PhaseScript,
  type ScriptBlock,
  type FieldConfig,
  type PhaseHints,
} from "@/lib/salesScriptContent";

export interface SalesPhaseRow extends PhaseScript {
  rowId: string;
  sortOrder: number;
  isActive: boolean;
  objections: { trigger: string; response: string }[];
}

const fallback = (): SalesPhaseRow[] =>
  STATIC_PHASE_ORDER.map((key, idx) => {
    const p = SALES_SCRIPT_CONTENT[key];
    return {
      ...p,
      rowId: key,
      sortOrder: idx,
      isActive: true,
      objections: [],
    };
  });

export function useSalesPhases() {
  const [phases, setPhases] = useState<SalesPhaseRow[]>(fallback());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales_phases")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      setPhases(fallback());
    } else {
      setPhases(
        data.map((r: any) => ({
          rowId: r.id,
          sortOrder: r.sort_order,
          isActive: r.is_active,
          id: r.phase_key,
          title: r.title,
          subtitle: r.subtitle,
          scriptBlocks: (r.script_blocks ?? []) as ScriptBlock[],
          fields: (r.fields ?? []) as FieldConfig[],
          hints: (r.hints ?? {
            dos: [],
            donts: [],
            listenFor: [],
            commonMistake: "",
          }) as PhaseHints,
          objections: r.objections ?? [],
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { phases, loading, reload: load };
}
