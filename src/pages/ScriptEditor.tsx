import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Save, FileText,
} from "lucide-react";
import { BLUEPRINT_PAGES } from "@/lib/blueprintConfig";
import {
  type ScriptPhase, type ScriptField, type ScriptObjection,
  type ScriptRecord, FIELD_TYPES,
} from "@/lib/scriptTypes";

interface Division { id: string; name: string }

const emptyPhase = (): ScriptPhase => ({
  name: "New Phase",
  goal: "",
  lines: [""],
  fields: [],
  objections: [],
  blueprint_path: "",
});

export default function ScriptEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [scripts, setScripts] = useState<ScriptRecord[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<ScriptRecord | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: s }, { data: d }] = await Promise.all([
      supabase.from("scripts").select("*").order("created_at", { ascending: false }),
      supabase.from("divisions").select("id, name").order("name"),
    ]);
    const list = (s ?? []).map((row) => ({
      ...row,
      content: Array.isArray(row.content) ? (row.content as unknown as ScriptPhase[]) : [],
    })) as ScriptRecord[];
    setScripts(list);
    setDivisions((d ?? []) as Division[]);
    if (id) {
      const found = list.find((x) => x.id === id) ?? null;
      setActive(found);
      setActiveIdx(0);
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, [id]);

  const phases = active?.content ?? [];
  const phase: ScriptPhase | null = phases[activeIdx] ?? null;

  const updateActive = (patch: Partial<ScriptRecord>) =>
    setActive((p) => (p ? { ...p, ...patch } : p));

  const updatePhase = (patch: Partial<ScriptPhase>) => {
    if (!active) return;
    const next = phases.slice();
    next[activeIdx] = { ...next[activeIdx], ...patch };
    updateActive({ content: next });
  };

  const movePhase = (from: number, to: number) => {
    if (!active || to < 0 || to >= phases.length) return;
    const next = phases.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateActive({ content: next });
    setActiveIdx(to);
  };

  const addPhase = () => {
    if (!active) return;
    updateActive({ content: [...phases, emptyPhase()] });
    setActiveIdx(phases.length);
  };

  const removePhase = (idx: number) => {
    if (!active) return;
    if (!confirm(`Remove phase "${phases[idx].name}"?`)) return;
    const next = phases.filter((_, i) => i !== idx);
    updateActive({ content: next });
    setActiveIdx(Math.max(0, Math.min(activeIdx, next.length - 1)));
  };

  const newScript = async () => {
    const { data, error } = await supabase
      .from("scripts")
      .insert({ title: "Untitled Script", category: "sales", is_active: false, content: [emptyPhase()] as unknown as never })
      .select()
      .single();
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    navigate(`/admin/scripts/${data.id}`);
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    const { error } = await supabase
      .from("scripts")
      .update({
        title: active.title,
        description: active.description,
        category: active.category,
        is_active: active.is_active,
        division_id: active.division_id,
        content: active.content as unknown as never,
      })
      .eq("id", active.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Script saved" });
      loadAll();
    }
  };

  const deleteScript = async () => {
    if (!active) return;
    if (!confirm(`Delete "${active.title}"? This cannot be undone.`)) return;
    await supabase.from("scripts").delete().eq("id", active.id);
    toast({ title: "Deleted" });
    navigate("/admin/scripts");
  };

  // Field & objection helpers
  const addField = () => {
    const fields = [...(phase?.fields ?? []), { key: "new_field", label: "New Field", type: "text" as const }];
    updatePhase({ fields });
  };
  const updateField = (i: number, patch: Partial<ScriptField>) => {
    const fields = (phase?.fields ?? []).map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    updatePhase({ fields });
  };
  const removeField = (i: number) => updatePhase({ fields: (phase?.fields ?? []).filter((_, idx) => idx !== i) });

  const addObjection = () => {
    const objections = [...(phase?.objections ?? []), { objection: "", response: "" }];
    updatePhase({ objections });
  };
  const updateObjection = (i: number, patch: Partial<ScriptObjection>) => {
    const objections = (phase?.objections ?? []).map((o, idx) => (idx === i ? { ...o, ...patch } : o));
    updatePhase({ objections });
  };
  const removeObjection = (i: number) =>
    updatePhase({ objections: (phase?.objections ?? []).filter((_, idx) => idx !== i) });

  const updateLine = (i: number, value: string) => {
    const lines = (phase?.lines ?? []).map((l, idx) => (idx === i ? value : l));
    updatePhase({ lines });
  };
  const addLine = () => updatePhase({ lines: [...(phase?.lines ?? []), ""] });
  const removeLine = (i: number) => updatePhase({ lines: (phase?.lines ?? []).filter((_, idx) => idx !== i) });

  const blueprintMappings = useMemo(() => {
    const map: Record<string, string> = {};
    phases.forEach((p) => { if (p.blueprint_path) map[p.blueprint_path] = p.name; });
    return map;
  }, [phases]);

  // ---------- LIST VIEW ----------
  if (!id) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Script Editor</h1>
                <p className="text-sm text-muted-foreground">Manage scripts and phases</p>
              </div>
            </div>
            <Button onClick={newScript}><Plus className="h-4 w-4 mr-2" /> New Script</Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 grid gap-3">
          {loading ? <p>Loading...</p> : scripts.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No scripts yet.</CardContent></Card>
          ) : scripts.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/admin/scripts/${s.id}`)}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.content.length} phases · {s.category ?? "uncategorized"}
                    </p>
                  </div>
                </div>
                <Badge variant={s.is_active ? "default" : "secondary"}>
                  {s.is_active ? "Active" : "Draft"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    );
  }

  if (loading || !active) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  // ---------- EDITOR VIEW ----------
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/scripts")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> All Scripts
            </Button>
            <div>
              <h1 className="font-bold">{active.title}</h1>
              <p className="text-xs text-muted-foreground">
                {phases.length} phases · {Object.keys(blueprintMappings).length} mapped to Blueprint
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={deleteScript}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar: script meta + phase list */}
        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Script details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={active.title} onChange={(e) => updateActive({ title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={2} value={active.description ?? ""} onChange={(e) => updateActive({ description: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={active.category ?? ""} onChange={(e) => updateActive({ category: e.target.value })} />
              </div>
              <div>
                <Label>Division</Label>
                <Select value={active.division_id ?? "none"} onValueChange={(v) => updateActive({ division_id: v === "none" ? null : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {divisions.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={active.is_active} onChange={(e) => updateActive({ is_active: e.target.checked })} />
                Published (active)
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Phases</CardTitle>
              <Button size="icon" variant="ghost" onClick={addPhase}><Plus className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {phases.map((p, i) => (
                <div
                  key={i}
                  className={`group flex items-center gap-1 rounded px-2 py-1.5 text-sm cursor-pointer ${i === activeIdx ? "bg-accent" : "hover:bg-muted"}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <span className="flex-1 truncate">
                    <span className="text-muted-foreground mr-1">{i + 1}.</span>{p.name}
                  </span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); movePhase(i, i - 1); }}><ChevronUp className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); movePhase(i, i + 1); }}><ChevronDown className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); removePhase(i); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main: phase editor */}
        {phase && (
          <section className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Phase {activeIdx + 1}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>Phase name</Label>
                    <Input value={phase.name} onChange={(e) => updatePhase({ name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Apply to Blueprint stage (override)</Label>
                    <Select value={phase.blueprint_path || "none"} onValueChange={(v) => updatePhase({ blueprint_path: v === "none" ? "" : v })}>
                      <SelectTrigger><SelectValue placeholder="Not mapped" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Not mapped —</SelectItem>
                        {BLUEPRINT_PAGES.map((bp) => (
                          <SelectItem key={bp.path} value={bp.path}>
                            {bp.id}. {bp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Phase goal</Label>
                  <Textarea rows={2} value={phase.goal ?? ""} onChange={(e) => updatePhase({ goal: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Script lines</CardTitle>
                <Button size="sm" variant="outline" onClick={addLine}><Plus className="h-4 w-4 mr-1" /> Add line</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {(phase.lines ?? []).map((line, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs text-muted-foreground pt-3 w-6">{i + 1}.</span>
                    <Textarea rows={2} value={line} onChange={(e) => updateLine(i, e.target.value)} className="flex-1" placeholder="Use {{first_name}}, {{agent_name}} etc. for placeholders" />
                    <Button size="icon" variant="ghost" onClick={() => removeLine(i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Embedded fields</CardTitle>
                <Button size="sm" variant="outline" onClick={addField}><Plus className="h-4 w-4 mr-1" /> Add field</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {(phase.fields ?? []).length === 0 && <p className="text-sm text-muted-foreground">No fields. Reps capture nothing in this phase.</p>}
                {(phase.fields ?? []).map((f, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <Input className="col-span-3" placeholder="key" value={f.key} onChange={(e) => updateField(i, { key: e.target.value })} />
                    <Input className="col-span-5" placeholder="Label" value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} />
                    <Select value={f.type} onValueChange={(v) => updateField(i, { type: v as ScriptField["type"] })}>
                      <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" className="col-span-1" onClick={() => removeField(i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Objection responses</CardTitle>
                <Button size="sm" variant="outline" onClick={addObjection}><Plus className="h-4 w-4 mr-1" /> Add objection</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {(phase.objections ?? []).length === 0 && <p className="text-sm text-muted-foreground">No objections handled in this phase.</p>}
                {(phase.objections ?? []).map((o, i) => (
                  <div key={i} className="grid gap-2 border rounded p-3">
                    <div className="flex justify-between items-center">
                      <Label>Objection</Label>
                      <Button size="icon" variant="ghost" onClick={() => removeObjection(i)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Input value={o.objection} onChange={(e) => updateObjection(i, { objection: e.target.value })} />
                    <Label>Response</Label>
                    <Textarea rows={2} value={o.response} onChange={(e) => updateObjection(i, { response: e.target.value })} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
