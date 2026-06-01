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

const GFUNNEL_ALLOWED_ORIGINS = new Set([
  "https://gfunnel.com",
  "https://www.gfunnel.com",
]);

let _context: GFunnelContext | null = null;
const _listeners: Set<ContextListener> = new Set();

function isTrustedGFunnelOrigin(origin: string): boolean {
  if (GFUNNEL_ALLOWED_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    return url.protocol === "https:" && (url.hostname === "gfunnel.com" || url.hostname.endsWith(".gfunnel.com"));
  } catch {
    return false;
  }
}

function getTargetOrigins(): string[] {
  const origins = new Set<string>(GFUNNEL_ALLOWED_ORIGINS);

  if (document.referrer) {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (isTrustedGFunnelOrigin(referrerOrigin)) {
        origins.add(referrerOrigin);
      }
    } catch {
      // Ignore malformed referrers.
    }
  }

  return [...origins];
}

export function initGFunnelBridge(moduleSlug: string) {
  const targetOrigins = getTargetOrigins();
  console.info("[GFunnel] bridge init", { moduleSlug, targetOrigins });

  window.addEventListener("message", (event: MessageEvent) => {
    // Log every message we receive so we can debug origin mismatches
    if (event.data?.type?.toString?.().startsWith?.("gfunnel:")) {
      console.info("[GFunnel] message received", {
        origin: event.origin,
        type: event.data?.type,
        accepted: isTrustedGFunnelOrigin(event.origin),
      });
    }

    // SECURITY BOUNDARY: only trust messages from the GFunnel shell origin.
    if (!isTrustedGFunnelOrigin(event.origin)) return;

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
    targetOrigins.forEach((origin) => {
      window.parent.postMessage(
        { type: "module:ready", payload: { module_slug: moduleSlug } },
        origin,
      );
    });
    console.info("[GFunnel] module:ready posted to parent", { targetOrigins });
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
