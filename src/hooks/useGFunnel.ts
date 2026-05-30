import { useState, useEffect, useRef } from "react";
import {
  initGFunnelBridge,
  onContextChange,
  isInsideGFunnel,
  getGFunnelContext,
  type GFunnelContext,
} from "@/lib/gfunnel-bridge";
import { supabase } from "@/integrations/supabase/client";

let bridgeInitialized = false;

const HANDSHAKE_TIMEOUT_MS = 6000;

export function useGFunnel(moduleSlug: string) {
  const [context, setContext] = useState<GFunnelContext | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [handshakeTimedOut, setHandshakeTimedOut] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    const embedded = isInsideGFunnel();
    setIsEmbedded(embedded);
    if (!bridgeInitialized) {
      initGFunnelBridge(moduleSlug);
      bridgeInitialized = true;
    }
    const off = onContextChange((ctx) => setContext(ctx));

    // If we're embedded but no init message arrives, stop blocking the UI.
    let timer: number | undefined;
    if (embedded) {
      timer = window.setTimeout(() => {
        setHandshakeTimedOut((prev) => {
          if (!getGFunnelContext()) {
            console.warn(
              "[GFunnel] handshake timeout — no gfunnel:init from https://www.gfunnel.com within",
              HANDSHAKE_TIMEOUT_MS,
              "ms. Falling back to standalone auth.",
            );
            return true;
          }
          return prev;
        });
      }, HANDSHAKE_TIMEOUT_MS);
    }

    return () => {
      off();
      if (timer) window.clearTimeout(timer);
    };
  }, [moduleSlug]);

  // When we receive context, ensure the user is signed in to Supabase as them.
  useEffect(() => {
    const sync = async () => {
      if (!context?.user_profile_id) return;
      if (syncedFor.current === context.user_profile_id) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        syncedFor.current = context.user_profile_id;
        return;
      }

      setSyncing(true);
      setSyncError(null);
      try {
        console.info("[GFunnel] invoking gfunnel-sso edge function");
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
          console.error("[GFunnel] gfunnel-sso failed", error, data);
          setSyncError(error?.message || data?.error || "SSO failed");
          return;
        }
        const { error: vErr } = await supabase.auth.verifyOtp({
          type: "magiclink",
          token_hash: data.token_hash,
        });
        if (vErr) {
          console.error("[GFunnel] verifyOtp failed", vErr);
          setSyncError(vErr.message);
          return;
        }
        console.info("[GFunnel] signed in as", context.user_email);
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
    // Ready when we have context (and finished syncing), OR we gave up waiting
    // for the parent shell. Either way we should unblock the UI.
    isReady: (context !== null && !syncing) || handshakeTimedOut,
    syncing,
    handshakeTimedOut,
    syncError,
    workspaceId: context?.workspace_id ?? null,
    workspaceSlug: context?.workspace_slug ?? null,
    userId: context?.user_profile_id ?? null,
    userEmail: context?.user_email ?? null,
    theme: context?.theme ?? "light",
  };
}

