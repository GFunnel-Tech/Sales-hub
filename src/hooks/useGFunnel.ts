import { useState, useEffect, useRef } from "react";
import {
  initGFunnelBridge,
  onContextChange,
  isInsideGFunnel,
  type GFunnelContext,
} from "@/lib/gfunnel-bridge";
import { supabase } from "@/integrations/supabase/client";

let bridgeInitialized = false;

export function useGFunnel(moduleSlug: string) {
  const [context, setContext] = useState<GFunnelContext | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    setIsEmbedded(isInsideGFunnel());
    if (!bridgeInitialized) {
      initGFunnelBridge(moduleSlug);
      bridgeInitialized = true;
    }
    return onContextChange((ctx) => setContext(ctx));
  }, [moduleSlug]);

  // When we receive context, ensure the user is signed in to Supabase as them.
  useEffect(() => {
    const sync = async () => {
      if (!context?.user_profile_id) return;
      if (syncedFor.current === context.user_profile_id) return;

      const { data: { session } } = await supabase.auth.getSession();
      // If already signed in as some user, treat as already synced.
      if (session?.user) {
        syncedFor.current = context.user_profile_id;
        return;
      }

      setSyncing(true);
      try {
        const { data, error } = await supabase.functions.invoke("gfunnel-sso", {
          body: {
            workspace_id: context.workspace_id,
            workspace_slug: context.workspace_slug,
            workspace_name: context.workspace_name,
            user_id: context.user_id,
            user_profile_id: context.user_profile_id,
            user_email: context.user_email,
            user_display_name: context.user_display_name,
            user_avatar_url: context.user_avatar_url,
            user_role: context.user_role,
          },
        });
        if (error || !data?.token_hash) {
          console.error("gfunnel-sso failed", error, data);
          return;
        }
        const { error: vErr } = await supabase.auth.verifyOtp({
          type: "magiclink",
          token_hash: data.token_hash,
        });
        if (vErr) {
          console.error("verifyOtp failed", vErr);
          return;
        }
        syncedFor.current = context.user_profile_id;
      } finally {
        setSyncing(false);
      }
    };
    sync();
  }, [context]);

  return {
    context,
    isEmbedded,
    isReady: context !== null && !syncing,
    syncing,
    workspaceId: context?.workspace_id ?? null,
    workspaceSlug: context?.workspace_slug ?? null,
    userId: context?.user_profile_id ?? null,
    userEmail: context?.user_email ?? null,
    theme: context?.theme ?? "light",
  };
}
