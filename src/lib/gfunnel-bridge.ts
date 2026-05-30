export interface GFunnelContext {
  workspace_id: string;
  workspace_slug: string;
  workspace_name?: string;
  user_id?: string;
  user_profile_id: string;
  user_email: string;
  user_display_name: string;
  user_avatar_url: string | null;
  user_role: string;
  theme: "dark" | "light";
  config?: Record<string, unknown>;
}

type ContextListener = (ctx: GFunnelContext) => void;

const GFUNNEL_ORIGIN = "https://www.gfunnel.com";

let _context: GFunnelContext | null = null;
const _listeners: Set<ContextListener> = new Set();

export function initGFunnelBridge(moduleSlug: string) {
  console.info("[GFunnel] bridge init", { moduleSlug, expectedOrigin: GFUNNEL_ORIGIN });

  window.addEventListener("message", (event: MessageEvent) => {
    // Log every message we receive so we can debug origin mismatches
    if (event.data?.type?.toString?.().startsWith?.("gfunnel:")) {
      console.info("[GFunnel] message received", {
        origin: event.origin,
        type: event.data?.type,
        accepted: event.origin === GFUNNEL_ORIGIN,
      });
    }

    // SECURITY BOUNDARY: only trust messages from the GFunnel shell origin.
    if (event.origin !== GFUNNEL_ORIGIN) return;

    const data = event.data;
    if (!data?.type) return;

    if (data.type === "gfunnel:init") {
      _context = data.payload as GFunnelContext;
      console.info("[GFunnel] init payload accepted", {
        workspace_id: _context.workspace_id,
        user_email: _context.user_email,
      });
      _listeners.forEach((fn) => fn(_context!));
    }
    if (data.type === "gfunnel:theme" && _context) {
      _context.theme = data.payload.theme;
      _listeners.forEach((fn) => fn(_context!));
    }
  });

  // Announce readiness to the parent shell.
  try {
    window.parent.postMessage(
      { type: "module:ready", payload: { module_slug: moduleSlug } },
      GFUNNEL_ORIGIN,
    );
    console.info("[GFunnel] module:ready posted to parent");
  } catch (e) {
    console.warn("[GFunnel] could not post module:ready", e);
  }
}

export function getGFunnelContext(): GFunnelContext | null {
  return _context;
}

export function onContextChange(listener: ContextListener): () => void {
  _listeners.add(listener);
  if (_context) listener(_context);
  return () => {
    _listeners.delete(listener);
  };
}

export function isInsideGFunnel(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
