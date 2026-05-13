import { useState } from "react";
import { Mic2, Cpu, Copy, ClipboardList, CalendarCheck, Database, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const CALL_TYPES = [
  { value: "follow-up", label: "Follow-up call" },
  { value: "demo", label: "Demo / presentation" },
  { value: "closing", label: "Closing call" },
  { value: "objection", label: "Objection handling" },
  { value: "discovery", label: "Discovery call" },
];

const SYSTEM_PROMPT = `You are an EMM (Expert Mortgage Marketing) sales coach AI. Analyze call transcripts and generate three structured deliverables. You specialize in DSCR/Non-QM mortgage marketing sales.

EMM context: Done-for-you Meta ads for DSCR investor loan leads. Price ~$1,500+/mo + ad spend. Guarantee: 5X ROAS target. Exclusive leads. Full CAPI/Pixel setup. Appointment setters included. Sales reps are Dawn (passion-transfer, authentic connection) and Jeff (calm, methodical). Key objections: price (real objection is always self-trust), burned before, comparing competitors, busy/not ready.

Respond ONLY with valid JSON — no markdown fences, no preamble:
{
  "debrief": {
    "summary": "2-3 sentence call summary",
    "score_rapport": 7,
    "score_objection": 6,
    "score_close": 5,
    "what_worked": ["item1","item2","item3"],
    "what_missed": ["item1","item2"],
    "key_moment": "The single most important moment in the call and why",
    "coaching_note": "One specific thing to do differently next call"
  },
  "prep": {
    "re_anchor": "Opening line to re-anchor the relationship on the next call",
    "their_situation": "Brief summary of prospect situation and goals",
    "open_objections": ["objection1","objection2"],
    "close_attempt": "Recommended closing approach for next call",
    "questions_to_ask": ["question1","question2","question3"],
    "watch_out_for": "One thing to avoid or watch for"
  },
  "pattern": {
    "objection_type": "Category of the main objection handled",
    "trigger": "What the prospect said that triggered the objection",
    "what_worked": "What response worked best",
    "what_to_try": "Alternative response to test",
    "pattern_name": "Short memorable name for this pattern",
    "library_note": "One sentence to add to the patterns library"
  }
}`;

interface DebriefResult {
  summary: string;
  score_rapport: number;
  score_objection: number;
  score_close: number;
  what_worked: string[];
  what_missed: string[];
  key_moment: string;
  coaching_note: string;
}

interface PrepResult {
  re_anchor: string;
  their_situation: string;
  open_objections: string[];
  close_attempt: string;
  questions_to_ask: string[];
  watch_out_for: string;
}

interface PatternResult {
  objection_type: string;
  trigger: string;
  what_worked: string;
  what_to_try: string;
  pattern_name: string;
  library_note: string;
}

interface AnalysisResult {
  debrief: DebriefResult;
  prep: PrepResult;
  pattern: PatternResult;
}

const TABS = [
  { id: "debrief", label: "Coaching debrief", icon: ClipboardList },
  { id: "prep", label: "Next call prep", icon: CalendarCheck },
  { id: "pattern", label: "Patterns entry", icon: Database },
];

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color = score >= 8 ? "text-emerald-600" : score >= 6 ? "text-amber-600" : "text-red-500";
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{score}<span className="text-sm text-gray-400 font-normal">/10</span></div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function BulletList({ items, variant }: { items: string[]; variant: "success" | "danger" | "warning" | "default" }) {
  const styles = {
    success: { wrap: "bg-emerald-50 border border-emerald-100 rounded-lg p-3", dot: "bg-emerald-400", text: "text-emerald-800" },
    danger: { wrap: "bg-red-50 border border-red-100 rounded-lg p-3", dot: "bg-red-400", text: "text-red-800" },
    warning: { wrap: "bg-amber-50 border border-amber-100 rounded-lg p-3", dot: "bg-amber-400", text: "text-amber-800" },
    default: { wrap: "", dot: "bg-gray-300", text: "text-gray-600" },
  }[variant];

  return (
    <ul className={`space-y-1.5 ${styles.wrap}`}>
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-2 text-sm ${styles.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} mt-2 flex-shrink-0`} />{item}
        </li>
      ))}
    </ul>
  );
}

export default function CallAnalyzer() {
  const [prospect, setProspect] = useState("");
  const [callType, setCallType] = useState("follow-up");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("debrief");
  const [error, setError] = useState("");

  const analyze = async () => {
    if (transcript.trim().length < 50) {
      setError("Please paste a call transcript first.");
      return;
    }
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
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{
            role: "user",
            content: `Analyze this ${callType} call with ${prospect || "prospect"}:\n\n${transcript}`,
          }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "{}";
      const parsed: AnalysisResult = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setActiveTab("debrief");
    } catch {
      setError("Analysis failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyTab = () => {
    if (!result) return;
    let text = "";
    if (activeTab === "debrief") {
      const d = result.debrief;
      text = `COACHING DEBRIEF\n\n${d.summary}\n\nScores: Rapport ${d.score_rapport}/10 | Objection ${d.score_objection}/10 | Close ${d.score_close}/10\n\nWhat worked:\n${d.what_worked.map(w => `• ${w}`).join("\n")}\n\nWhat to improve:\n${d.what_missed.map(m => `• ${m}`).join("\n")}\n\nKey moment: ${d.key_moment}\n\nCoaching note: ${d.coaching_note}`;
    } else if (activeTab === "prep") {
      const p = result.prep;
      text = `NEXT CALL PREP\n\nOpener: "${p.re_anchor}"\n\nSituation: ${p.their_situation}\n\nOpen objections:\n${p.open_objections.map(o => `• ${o}`).join("\n")}\n\nQuestions:\n${p.questions_to_ask.map(q => `• ${q}`).join("\n")}\n\nClose: ${p.close_attempt}\n\nWatch out for: ${p.watch_out_for}`;
    } else {
      const pa = result.pattern;
      text = `PATTERN: ${pa.pattern_name}\n\nType: ${pa.objection_type}\nTrigger: "${pa.trigger}"\n\nWorked: ${pa.what_worked}\nTest: ${pa.what_to_try}\n\nLibrary: ${pa.library_note}`;
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
          <Mic2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Call analysis</h2>
          <p className="text-xs text-gray-500">Paste any transcript → debrief, prep sheet, patterns entry</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={prospect}
          onChange={(e) => setProspect(e.target.value)}
          placeholder="Prospect name"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={callType}
          onChange={(e) => setCallType(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {CALL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste call transcript here..."
        rows={7}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono leading-relaxed resize-none"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={analyze}
          disabled={loading || transcript.trim().length < 50}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Cpu className="w-4 h-4" />
          {loading ? "Analyzing..." : "Analyze call"}
        </button>
        {loading && <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />}
        <span className="ml-auto text-xs text-gray-400">{transcript.length.toLocaleString()} characters</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {result && !loading && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-700 font-medium bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />{tab.label}
                </button>
              );
            })}
            <button onClick={copyTab} className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 transition-colors">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          {activeTab === "debrief" && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3">
                <ScoreCircle score={result.debrief.score_rapport} label="Rapport" />
                <ScoreCircle score={result.debrief.score_objection} label="Objection handling" />
                <ScoreCircle score={result.debrief.score_close} label="Close attempt" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{result.debrief.summary}</p>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                  <TrendingUp className="w-3 h-3" /> What worked
                </div>
                <BulletList items={result.debrief.what_worked} variant="success" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-2">
                  <TrendingDown className="w-3 h-3" /> What to improve
                </div>
                <BulletList items={result.debrief.what_missed} variant="danger" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Key moment</p>
                <p className="text-sm text-gray-600 leading-relaxed">{result.debrief.key_moment}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1">Coaching note</p>
                <p className="text-sm text-amber-800">{result.debrief.coaching_note}</p>
              </div>
            </div>
          )}

          {activeTab === "prep" && (
            <div className="p-4 space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-1.5">Opening re-anchor</p>
                <p className="text-sm text-emerald-800 italic">"{result.prep.re_anchor}"</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Their situation</p>
                <p className="text-sm text-gray-600">{result.prep.their_situation}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">Open objections to address</p>
                <BulletList items={result.prep.open_objections} variant="warning" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Questions to ask</p>
                <BulletList items={result.prep.questions_to_ask} variant="default" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Recommended close approach</p>
                <p className="text-sm text-gray-600">{result.prep.close_attempt}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1">Watch out for</p>
                <p className="text-sm text-red-700">{result.prep.watch_out_for}</p>
              </div>
            </div>
          )}

          {activeTab === "pattern" && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Pattern name</p>
                <p className="text-base font-semibold text-gray-900">{result.pattern.pattern_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Objection type</p>
                  <p className="text-sm text-gray-600">{result.pattern.objection_type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Trigger phrase</p>
                  <p className="text-sm text-gray-600 italic">"{result.pattern.trigger}"</p>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">What worked</p>
                <p className="text-sm text-emerald-800">{result.pattern.what_worked}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1">Alternative to test next time</p>
                <p className="text-sm text-amber-800">{result.pattern.what_to_try}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Library entry</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">{result.pattern.library_note}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
