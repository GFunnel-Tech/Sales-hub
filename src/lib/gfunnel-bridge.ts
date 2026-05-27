export interface GFunnelContext {
  workspace_id: string
  workspace_slug: string
  user_id: string
  user_display_name: string
  user_email: string
  user_avatar_url: string | null
  user_role: string
  theme: 'dark' | 'light'
  config: Record<string, unknown>
  gfunnel_supabase_url: string
  gfunnel_supabase_anon_key: string
}

type ContextListener = (ctx: GFunnelContext) => void

let _context: GFunnelContext | null = null
const _listeners: Set<ContextListener> = new Set()

export function initGFunnelBridge(moduleSlug: string) {
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.origin !== 'https://www.gfunnel.com') return
    const data = event.data
    if (!data?.type) return
    if (data.type === 'gfunnel:init') {
      _context = data.payload as GFunnelContext
      _listeners.forEach((fn) => fn(_context!))
      window.parent.postMessage(
        { type: 'module:ready', payload: { module_slug: moduleSlug } },
        'https://www.gfunnel.com'
      )
    }
    if (data.type === 'gfunnel:theme') {
      if (_context) {
        _context.theme = data.payload.theme
        _listeners.forEach((fn) => fn(_context!))
      }
    }
  })
  window.parent.postMessage(
    { type: 'module:ready', payload: { module_slug: moduleSlug } },
    '*'
  )
}

export function getGFunnelContext(): GFunnelContext | null { return _context }

export function onContextChange(listener: ContextListener): () => void {
  _listeners.add(listener)
  if (_context) listener(_context)
  return () => { _listeners.delete(listener) }
}

export function isInsideGFunnel(): boolean {
  try { return window.self !== window.top } catch { return true }
}
