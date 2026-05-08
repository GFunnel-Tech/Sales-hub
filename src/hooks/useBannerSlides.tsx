import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useMember } from "./useMember";

export type BannerAudience = "all" | "admin" | "setter" | "closer" | "salesperson";
export type BannerPlacement = "home" | "sales_hub" | "marketing";

export interface BannerSlide {
  id: string;
  audience: BannerAudience;
  placement: BannerPlacement;
  title: string;
  description: string;
  cta_label: string;
  cta_href: string;
  icon: string;
  gradient: string;
  accent_gradient: string;
  sort_order: number;
  is_active: boolean;
}

/** Determine the current viewer's audience for content tailoring. */
export function useViewerAudience(): BannerAudience {
  const { isAdmin } = useAuth();
  const { member } = useMember();
  const [override, setOverride] = useState<BannerAudience | null>(null);

  useEffect(() => {
    // ?as=setter|closer|admin overrides for previewing
    const params = new URLSearchParams(window.location.search);
    const as = params.get("as") as BannerAudience | null;
    if (as && ["all", "admin", "setter", "closer", "salesperson"].includes(as)) {
      setOverride(as);
    }
  }, []);

  if (override) return override;
  if (isAdmin) return "admin";

  const aud = (member as { audience?: string } | null)?.audience?.toLowerCase();
  if (aud === "setter" || aud === "closer" || aud === "admin" || aud === "salesperson") {
    return aud as BannerAudience;
  }

  // Heuristic: try to infer from member full name / id (e.g. "SETTER-001")
  const memberId = member?.member_id?.toUpperCase() ?? "";
  if (memberId.includes("SETTER")) return "setter";
  if (memberId.includes("CLOSER")) return "closer";

  return "all";
}

export function useBannerSlides(placement: BannerPlacement) {
  const audience = useViewerAudience();
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      // Fetch slides matching the audience OR 'all'
      const { data, error } = await supabase
        .from("banner_slides")
        .select("*")
        .eq("placement", placement)
        .eq("is_active", true)
        .in("audience", audience === "all" ? ["all"] : [audience, "all"])
        .order("sort_order", { ascending: true });

      if (!active) return;
      if (error) {
        console.error("banner_slides fetch error", error);
        setSlides([]);
      } else {
        // Prefer audience-specific slides; if any exist, hide generic 'all' slides.
        const list = (data ?? []) as BannerSlide[];
        const specific = list.filter((s) => s.audience === audience);
        setSlides(specific.length > 0 ? specific : list);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [placement, audience]);

  return { slides, loading, audience };
}
