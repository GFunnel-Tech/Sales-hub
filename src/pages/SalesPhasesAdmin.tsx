import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SALES_SCRIPT_CONTENT, PHASE_ORDER as STATIC_PHASE_ORDER } from "@/lib/salesScriptContent";

type Block = {
  type: "speech" | "instruction" | "question" | "action" | "capture";
  content: string;
  highlight?: boolean;
  label?: string;
  fieldId?: string;
  fieldType?: "text" | "textarea" | "yesno" | "select";
  placeholder?: string;
  required?: boolean;
  inline?: boolean;
};

type Field = {
  id: string;
  label: string;
  type: "text" | "textarea" | "yesno" | "select";
  placeholder?: string;
  required?: boolean;
};

type Hints = {
  dos: string[];
  donts: string[];
  listenFor: string[];
  commonMistake: string;
  powerMove?: string;
};

type Objection = { trigger: string; response: string };

interface PhaseRow {
  id: string;
  phase_key: string;
  sort_order: number;
  title: string;
  subtitle: string;
  script_blocks: Block[];
  fields: Field[];
  hints: Hints;
  objections: Objection[];
  is_active: boolean;
}

const emptyHints: Hints = { dos: [], donts: [], listenFor: [], commonMistake: "", powerMove: "" };

export default function SalesPhasesAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rows, setRows] = useState<PhaseRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales_phases")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      const list = (data ?? []) as any[];
      setRows(list);
      setSelectedId((curr) => curr ?? list[0]?.id ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateSelected = (patch: Partial<PhaseRow>) => {
    if (!selected) return;
    setRows((rs) => rs.map((r) => (r.id === selected.id ? { ...r, ...patch } : r)));
  };

  const savePhase = async (phase: PhaseRow) => {
    setSaving(true);
    const { error } = await supabase
      .from("sales_phases")
      .update({
        title: phase.title,
        subtitle: phase.subtitle,
        sort_order: phase.sort_order,
        is_active: phase.is_active,
        script_blocks: phase.script_blocks as any,
        fields: phase.fields as any,
        hints: phase.hints as any,
        objections: phase.objections as any,
      })
      .eq("id", phase.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `${phase.title} updated.` });
    }
  };

  const move = async (phase: PhaseRow, dir: -1 | 1) => {
    const idx = rows.findIndex((r) => r.id === phase.id);
    const swap = rows[idx + dir];
    if (!swap) return;
    const a = { ...phase, sort_order: swap.sort_order };
    const b = { ...swap, sort_order: phase.sort_order };
    setRows((rs) => rs.map((r) => (r.id === a.id ? a : r.id === b.id ? b : r)).sort((x, y) => x.sort_order - y.sort_order));
    await Promise.all([
      supabase.from("sales_phases").update({ sort_order: a.sort_order }).eq("id", a.id),
      supabase.from("sales_phases").update({ sort_order: b.sort_order }).eq("id", b.id),
    ]);
  };

  const resetDefaults = async () => {
    if (!confirm("Reset ALL 7 phases back to the original defaults? Custom edits will be overwritten.")) return;
    setSaving(true);
    for (let i = 0; i < STATIC_PHASE_ORDER.length; i++) {
      const key = STATIC_PHASE_ORDER[i];
      const def = SALES_SCRIPT_CONTENT[key];
      await supabase
        .from("sales_phases")
        .upsert(
          {
            phase_key: key,
            sort_order: i,
            title: def.title,
            subtitle: def.subtitle,
            script_blocks: def.scriptBlocks as any,
            fields: def.fields as any,
            hints: def.hints as any,
            objections: [] as any,
            is_active: true,
          },
          { onConflict: "org_id,phase_key" }
        );
    }
    setSaving(false);
    await load();
    toast({ title: "Defaults restored" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading sales phases…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Admin
            </Button>
            <div>
              <h1 className="text-xl font-bold">Sales Phases Editor</h1>
              <p className="text-xs text-muted-foreground">Edit the 7-step live sales script</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetDefaults} disabled={saving}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to defaults
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[260px,1fr] gap-6">
        <aside className="space-y-2">
          {rows.map((r, idx) => (
            <div
              key={r.id}
              className={`flex items-center gap-1 rounded-md border p-2 ${selectedId === r.id ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <button onClick={() => setSelectedId(r.id)} className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground">STEP {idx + 1}</span>
                  {!r.is_active && <Badge variant="outline" className="text-[10px] h-4">Hidden</Badge>}
                </div>
                <div className="text-sm font-medium leading-tight">{r.title}</div>
              </button>
              <div className="flex flex-col">
                <button onClick={() => move(r, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button onClick={() => move(r, 1)} disabled={idx === rows.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </aside>

        {selected && (
          <section>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selected.title || "(Untitled)"}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">phase_key: {selected.phase_key}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={selected.is_active} onCheckedChange={(v) => updateSelected({ is_active: v })} />
                    <span className="text-sm">Active</span>
                  </div>
                  <Button onClick={() => savePhase(selected)} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="script">Script Blocks</TabsTrigger>
                    <TabsTrigger value="fields">Capture Fields</TabsTrigger>
                    <TabsTrigger value="hints">Hints & Tips</TabsTrigger>
                    <TabsTrigger value="objections">Objections</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={selected.title} onChange={(e) => updateSelected({ title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input value={selected.subtitle ?? ""} onChange={(e) => updateSelected({ subtitle: e.target.value })} />
                    </div>
                  </TabsContent>

                  <TabsContent value="script" className="space-y-3 pt-4">
                    {selected.script_blocks.map((b, i) => (
                      <Card key={i} className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Select
                            value={b.type}
                            onValueChange={(v) =>
                              updateSelected({
                                script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, type: v as Block["type"] } : x)),
                              })
                            }
                          >
                            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="speech">Speech</SelectItem>
                              <SelectItem value="instruction">Instruction</SelectItem>
                              <SelectItem value="question">Question</SelectItem>
                              <SelectItem value="action">Action</SelectItem>
                              <SelectItem value="capture">Capture</SelectItem>
                            </SelectContent>
                          </Select>
                          <label className="flex items-center gap-1 text-xs">
                            <Switch
                              checked={!!b.highlight}
                              onCheckedChange={(v) =>
                                updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, highlight: v } : x)) })
                              }
                            />
                            Highlight
                          </label>
                          <div className="flex-1" />
                          <Button size="icon" variant="ghost" onClick={() => updateSelected({ script_blocks: selected.script_blocks.filter((_, j) => j !== i) })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          rows={2}
                          value={b.content}
                          placeholder="Block content"
                          onChange={(e) =>
                            updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)) })
                          }
                        />
                        {b.type === "capture" && (
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="fieldId" value={b.fieldId ?? ""} onChange={(e) => updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, fieldId: e.target.value } : x)) })} />
                            <Input placeholder="label" value={b.label ?? ""} onChange={(e) => updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                            <Select value={b.fieldType ?? "text"} onValueChange={(v) => updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, fieldType: v as any } : x)) })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="yesno">Yes/No</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="placeholder" value={b.placeholder ?? ""} onChange={(e) => updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, placeholder: e.target.value } : x)) })} />
                          </div>
                        )}
                        {b.type === "action" && (
                          <Input placeholder="Button label" value={b.label ?? ""} onChange={(e) => updateSelected({ script_blocks: selected.script_blocks.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                        )}
                      </Card>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => updateSelected({ script_blocks: [...selected.script_blocks, { type: "speech", content: "" }] })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add block
                    </Button>
                  </TabsContent>

                  <TabsContent value="fields" className="space-y-3 pt-4">
                    {selected.fields.map((f, i) => (
                      <Card key={i} className="p-3 grid grid-cols-[1fr,1fr,140px,40px] gap-2 items-center">
                        <Input placeholder="id" value={f.id} onChange={(e) => updateSelected({ fields: selected.fields.map((x, j) => (j === i ? { ...x, id: e.target.value } : x)) })} />
                        <Input placeholder="label" value={f.label} onChange={(e) => updateSelected({ fields: selected.fields.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                        <Select value={f.type} onValueChange={(v) => updateSelected({ fields: selected.fields.map((x, j) => (j === i ? { ...x, type: v as any } : x)) })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="yesno">Yes/No</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="icon" variant="ghost" onClick={() => updateSelected({ fields: selected.fields.filter((_, j) => j !== i) })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Card>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => updateSelected({ fields: [...selected.fields, { id: "", label: "", type: "text" }] })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add field
                    </Button>
                  </TabsContent>

                  <TabsContent value="hints" className="space-y-4 pt-4">
                    {(["dos", "donts", "listenFor"] as const).map((key) => (
                      <div key={key}>
                        <Label className="capitalize">{key === "dos" ? "Do's" : key === "donts" ? "Don'ts" : "Listen for"}</Label>
                        <Textarea
                          rows={4}
                          value={(selected.hints?.[key] ?? []).join("\n")}
                          placeholder="One per line"
                          onChange={(e) =>
                            updateSelected({
                              hints: { ...(selected.hints ?? emptyHints), [key]: e.target.value.split("\n").filter(Boolean) },
                            })
                          }
                        />
                      </div>
                    ))}
                    <div>
                      <Label>Common mistake</Label>
                      <Textarea rows={2} value={selected.hints?.commonMistake ?? ""} onChange={(e) => updateSelected({ hints: { ...(selected.hints ?? emptyHints), commonMistake: e.target.value } })} />
                    </div>
                    <div>
                      <Label>Power move</Label>
                      <Textarea rows={2} value={selected.hints?.powerMove ?? ""} onChange={(e) => updateSelected({ hints: { ...(selected.hints ?? emptyHints), powerMove: e.target.value } })} />
                    </div>
                  </TabsContent>

                  <TabsContent value="objections" className="space-y-3 pt-4">
                    {selected.objections.map((o, i) => (
                      <Card key={i} className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input placeholder="Objection trigger" value={o.trigger} onChange={(e) => updateSelected({ objections: selected.objections.map((x, j) => (j === i ? { ...x, trigger: e.target.value } : x)) })} />
                          <Button size="icon" variant="ghost" onClick={() => updateSelected({ objections: selected.objections.filter((_, j) => j !== i) })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea rows={2} placeholder="Your response" value={o.response} onChange={(e) => updateSelected({ objections: selected.objections.map((x, j) => (j === i ? { ...x, response: e.target.value } : x)) })} />
                      </Card>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => updateSelected({ objections: [...selected.objections, { trigger: "", response: "" }] })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add objection
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
