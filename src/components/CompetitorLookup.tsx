import { useState } from "react";
import { Shield, Zap, Copy, Search, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const KNOWN_COMPETITORS = [
  "Lead Hackers",
  "Good Vibe Squad",
  "Goat Genie",
  "Media Simplified",
  "LendingTree",
  "Aged leads",
];

const SYSTEM_PROMPT = `You are an EMM (Expert Mortgage Marketing) sales intelligence tool used live during prospect calls. Your job is to give the sales rep instant, actionable competitor intel — formatted for fast scanning mid-call.

EMM context:
- Done-for-you DSCR/Non-QM investor lead generation via Meta ads
- Dedicated media buyer per account; full CAPI/Pixel setup; branded video + mixed-media dynamic campaigns (Andromeda-optimized)
- Appointment setters included; leads are exclusive (prospect owns all leads)
- Specific written performance guarantee (5X ROAS target)
- Price: ~$1,500+/mo management fee + client funds own ad spend
- Niche specialist: DSCR/Non-QM only — not general mortgage

Known competitors:
- Lead Hackers: DIY self-serve software. NAMB/AIME endorsed. 3-click ad launch. No dedicated account manager. No appointment setters. LO runs own ads — results depend on LO skill/time. Key pain: "Who manages your account when you're busy closing deals?"
- Good Vibe Squad (GVS): Done-for-you fractional CMO. Facebook ads focus. ~$1,500-3,000+/mo. General mortgage (not DSCR specialist). No CAPI/server-side tracking emphasis. No appointment setters. Key pain: "Are they DSCR-specific or general mortgage?"
- Goat Genie: Low-cost provider. ~$300/mo + ad spend. Key pain: "At $300/mo, who is actively optimizing your account daily?"
- Media Simplified: Mortgage marketing agency. Key pain: "What does their guarantee cover specifically?"
- LendingTree / Bankrate: Lead aggregators. Shared leads sold to 5 lenders simultaneously. Key pain: "How many other LOs get that same lead within 10 minutes of you?"
- Aged leads: Bought lists. Stale data. Low intent. Key pain: "What is your cost per FUNDED DEAL — not cost per lead?"

Framing rule: Always use peer-review language. Never bash competitors directly. Use "one of our clients left them because..." framing.

Respond ONLY with valid JSON, no markdown fences, no preamble:
{
  "name": "Competitor name",
  "type": "DFY Agency | DIY Software | Low-Cost | Lead Aggregator | Other",
  "pricing": "Pricing info or Not public / demo required",
  "model": "One sentence description of their model",
  "client_complaints": ["complaint 1", "complaint 2", "complaint 3"],
  "kill_questions": ["question 1", "question 2", "question 3"],
  "emm_wins": ["win 1", "win 2", "win 3"],
  "suggested_opener": "One sentence peer-review opener the rep can say right now on the call",
  "intel_quality": "full | partial | low"
}`;

interface CompetitorResult {
  name: string;
  type: string;
  pricing: string;
  model: string;
  client_complaints: string[];
  kill_questions: string[];
  emm_wins: string[];
  suggested_opener: string;
  intel_quality: "full" | "partial" | "low";
}

const TYPE_COLORS: Record<string, string> = {
  "DFY Agency": "bg-blue-50 text-blue-700 border border-blue-200",
  "DIY Software": "bg-red-50 text-red-700 border border-red-200",
  "Low-Cost": "bg-amber-50 text-amber-700 border border-amber-200",
  "Lead Aggregator": "bg-gray-100 text-gray-600 border border-gray-200",
  "Other": "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function CompetitorLookup() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitorResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const lookup = async (name: string) => {
    const q = name || query.trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Give me competitor intel on: ${q}` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "{}";
      const parsed: CompetitorResult = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch {
      setError("Failed to load intel. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = [
      `COMPETITOR: ${result.name} (${result.type})`,
      `PRICING: ${result.pricing}`,
      `MODEL: ${result.model}`,
      `\nWHAT CLIENTS SAY:`,
      ...result.client_complaints.map((c) => `• ${c}`),
      `\nKILL QUESTIONS:`,
      ...result.kill_questions.map((q) => `• ${q}`),
      `\nEMM WINS:`,
      ...result.emm_wins.map((w) => `• ${w}`),
      `\nSAY THIS: "${result.suggested_opener}"`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Competitor lookup</h2>
          <p className="text-xs text-gray-500">Live intel during prospect calls</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {KNOWN_COMPETITORS.map((c) => (
          <button
            key={c}
            onClick={() => lookup(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              result?.name === c
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup(query)}
            placeholder="Type any competitor name..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => lookup(query)}
          disabled={loading || !query.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          {loading ? "Loading..." : "Look up"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-blue-700">Pulling intel on {query}...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700">
          <XCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {result && !loading && (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{result.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[result.type] ?? TYPE_COLORS["Other"]}`}>
                {result.type}
              </span>
              {result.intel_quality === "low" && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> partial intel
                </span>
              )}
            </div>
            <button
              onClick={copyResult}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Pricing</p>
                <p className="text-sm text-gray-700 font-medium">{result.pricing}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Their model</p>
                <p className="text-sm text-gray-600">{result.model}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">What clients say / why they left</p>
              <ul className="space-y-1">
                {result.client_complaints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />{c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-2">Kill questions to ask them</p>
              <ul className="space-y-1">
                {result.kill_questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />{q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />EMM wins head-to-head
              </p>
              <ul className="space-y-1">
                {result.emm_wins.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />{w}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Say this right now</p>
              <blockquote className="border-l-2 border-blue-400 pl-3 text-sm text-gray-700 italic">
                "{result.suggested_opener}"
              </blockquote>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="flex flex-col items-center gap-2 py-10 text-center border border-dashed border-gray-200 rounded-xl">
          <Shield className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-400">Pick a competitor or type one above</p>
        </div>
      )}
    </div>
  );
}
