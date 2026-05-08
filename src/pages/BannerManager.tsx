import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { BannerSlide, BannerAudience, BannerPlacement } from "@/hooks/useBannerSlides";

const AUDIENCES: BannerAudience[] = ["all", "admin", "setter", "closer", "salesperson"];
const PLACEMENTS: BannerPlacement[] = ["home", "sales_hub", "marketing"];

const GRADIENT_PRESETS = [
  "from-violet-600 via-purple-500 to-fuchsia-500",
  "from-blue-600 via-cyan-500 to-teal-400",
  "from-orange-500 via-amber-500 to-yellow-400",
  "from-rose-500 via-pink-500 to-purple-500",
  "from-emerald-600 via-teal-500 to-cyan-400",
  "from-amber-600 via-orange-500 to-red-500",
  "from-purple-600 via-pink-500 to-rose-500",
  "from-slate-700 via-slate-600 to-zinc-600",
];

const ICON_OPTIONS = [
  "Rocket", "Calendar", "GraduationCap", "Sparkles", "PhoneCall", "Target",
  "MessageCircle", "Trophy", "Briefcase", "DollarSign", "BarChart3",
  "UserPlus", "LayoutGrid", "Lightbulb", "Heart", "Zap",
];

const emptyForm = {
  audience: "all" as BannerAudience,
  placement: "home" as BannerPlacement,
  title: "",
  description: "",
  cta_label: "Learn More",
  cta_href: "/",
  icon: "Sparkles",
  gradient: GRADIENT_PRESETS[0],
  accent_gradient: "from-pink-400 via-orange-300 to-yellow-400",
  sort_order: 0,
  is_active: true,
};

export default function BannerManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BannerPlacement | "all_p">("all_p");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BannerSlide | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banner_slides")
      .select("*")
      .order("placement", { ascending: true })
      .order("audience", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setSlides((data ?? []) as BannerSlide[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (s: BannerSlide) => {
    setEditing(s);
    setForm({
      audience: s.audience, placement: s.placement, title: s.title,
      description: s.description, cta_label: s.cta_label, cta_href: s.cta_href,
      icon: s.icon, gradient: s.gradient, accent_gradient: s.accent_gradient,
      sort_order: s.sort_order, is_active: s.is_active,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Title and description required", variant: "destructive" });
      return;
    }
    const payload = { ...form };
    const { error } = editing
      ? await supabase.from("banner_slides").update(payload).eq("id", editing.id)
      : await supabase.from("banner_slides").insert(payload);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Banner updated" : "Banner created" });
    setDialogOpen(false);
    load();
  };

  const toggleActive = async (s: BannerSlide) => {
    await supabase.from("banner_slides").update({ is_active: !s.is_active }).eq("id", s.id);
    load();
  };

  const remove = async (s: BannerSlide) => {
    if (!confirm(`Delete banner "${s.title}"?`)) return;
    await supabase.from("banner_slides").delete().eq("id", s.id);
    toast({ title: "Banner deleted" });
    load();
  };

  const filtered = filter === "all_p" ? slides : slides.filter((s) => s.placement === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Banner Manager</h1>
              <p className="text-sm text-muted-foreground">
                Tailor home and sales hub banners by role
              </p>
            </div>
          </div>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> New Banner
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Slides</CardTitle>
            <div className="w-48">
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_p">All placements</SelectItem>
                  {PLACEMENTS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground">No banners yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placement</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>CTA</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell><Badge variant="outline">{s.placement}</Badge></TableCell>
                      <TableCell><Badge>{s.audience}</Badge></TableCell>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.cta_label} → {s.cta_href}
                      </TableCell>
                      <TableCell>{s.sort_order}</TableCell>
                      <TableCell>
                        <Badge variant={s.is_active ? "default" : "secondary"}>
                          {s.is_active ? "Active" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => toggleActive(s)}>
                          {s.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(s)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Preview as role</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <Button key={a} variant="outline" size="sm" asChild>
                <a href={`/?as=${a}`} target="_blank" rel="noreferrer">View home as {a}</a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Banner" : "New Banner"}</DialogTitle>
            <DialogDescription>
              Banners filter by placement and audience. Use "all" to show to everyone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Placement</Label>
                <Select value={form.placement} onValueChange={(v) => setForm({ ...form, placement: v as BannerPlacement })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLACEMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Audience</Label>
                <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v as BannerAudience })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Label</Label>
                <Input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
              </div>
              <div>
                <Label>CTA Link</Label>
                <Input value={form.cta_href} onChange={(e) => setForm({ ...form, cta_href: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div>
              <Label>Background Gradient</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {GRADIENT_PRESETS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gradient: g })}
                    className={`h-12 rounded bg-gradient-to-br ${g} ${form.gradient === g ? "ring-2 ring-foreground" : ""}`}
                  />
                ))}
              </div>
              <Input className="mt-2" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
            </div>

            <div>
              <Label>Accent Gradient (Tailwind classes)</Label>
              <Input value={form.accent_gradient} onChange={(e) => setForm({ ...form, accent_gradient: e.target.value })} />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
