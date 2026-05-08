// Helper to call member-scoped edge functions with the member ID header.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getMemberId(): string | null {
  return sessionStorage.getItem("sales_hub_member");
}

async function call(fn: string, path: string, init: RequestInit = {}) {
  const memberId = getMemberId();
  if (!memberId) throw new Error("No member session");

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fn}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ANON_KEY}`,
      "apikey": ANON_KEY,
      "x-member-id": memberId,
      ...(init.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export const memberApi = {
  // Sales
  listSales: () => call("member-sales", "?action=list"),
  getStats: () => call("member-sales", "?action=stats"),
  createSale: (body: Record<string, unknown>) =>
    call("member-sales", "?action=create", { method: "POST", body: JSON.stringify(body) }),
  searchSalesLeads: (q: string) =>
    call("member-sales", `?action=search-leads&q=${encodeURIComponent(q)}`),

  // Commissions & Payouts
  getCommissions: () => call("member-sales", "?action=commissions"),
  listPayouts: () => call("member-sales", "?action=payouts"),
  requestPayout: (body: Record<string, unknown>) =>
    call("member-sales", "?action=request-payout", { method: "POST", body: JSON.stringify(body) }),

  // Blueprint
  createBlueprintSession: (body: Record<string, unknown>) =>
    call("member-blueprint", "?action=create", { method: "POST", body: JSON.stringify(body) }),
  updateBlueprintSession: (sessionId: string, body: Record<string, unknown>) =>
    call("member-blueprint", `?action=update&session_id=${encodeURIComponent(sessionId)}`,
      { method: "PATCH", body: JSON.stringify(body) }),
  completeBlueprintSession: (sessionId: string, body: Record<string, unknown>) =>
    call("member-blueprint", `?action=complete&session_id=${encodeURIComponent(sessionId)}`,
      { method: "PATCH", body: JSON.stringify(body) }),
  searchBlueprintLeads: (q: string) =>
    call("member-blueprint", `?action=search-leads&q=${encodeURIComponent(q)}`),
};
