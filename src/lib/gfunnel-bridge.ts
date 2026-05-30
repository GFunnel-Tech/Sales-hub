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
  window.addEventListener("message", (event: MessageEvent) => {
    // SECURITY BOUNDARY: only trust messages from the GFunnel shell origin.
    if (event.origin !== GFUNNEL_ORIGIN) return;

    const data = event.data;
    if (!data?.type) return;

    if (data.type === "gfunnel:init") {
      _context = data.payload as GFunnelContext;
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
  } catch {
    /* not embedded — ignore */
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
