import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMember } from "@/hooks/useMember";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  FileText, 
  PlusCircle,
  Loader2,
  Send,
  CheckCircle
} from "lucide-react";

interface Script {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  content: any[];
}

export default function Scripts() {
  const { member } = useMember();
  const { toast } = useToast();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    product_name: "",
    product_description: "",
    target_audience: "",
    key_benefits: "",
    common_objections: ""
  });

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const scriptsData = (data || []).map(script => ({
        id: script.id,
        title: script.title,
        description: script.description,
        category: script.category,
        content: Array.isArray(script.content) ? script.content : []
      }));
      setScripts(scriptsData);
    } catch (error) {
      console.error("Error fetching scripts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Error",
        description: "You must be logged in to request a script.",
        variant: "destructive"
      });
      return;
    }

    if (!requestForm.product_name) {
      toast({
        title: "Missing information",
        description: "Please enter the product/service name.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("script_requests")
        .insert({
          user_id: member.id,
          product_name: requestForm.product_name,
          product_description: requestForm.product_description || null,
          target_audience: requestForm.target_audience || null,
          key_benefits: requestForm.key_benefits || null,
          common_objections: requestForm.common_objections || null
        });

      if (error) throw error;

      toast({
        title: "Request submitted!",
        description: "We'll create a custom script for your product/service."
      });

      setRequestDialogOpen(false);
      setRequestForm({
        product_name: "",
        product_description: "",
        target_audience: "",
        key_benefits: "",
        common_objections: ""
      });
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SalesHubNavigation />

      <main className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-20">
        {/* Editorial header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-4">
              Script Library
            </p>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight text-foreground">
              Scripts that <span className="italic text-primary">close</span>.
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              Browse battle-tested sales scripts or request a custom one tailored to your offer.
            </p>
          </div>
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-6">
                <PlusCircle className="w-4 h-4 mr-2" />
                Request Custom Script
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Request a Custom Script</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Product/Service Name *</Label>
                  <Input id="product_name" value={requestForm.product_name} onChange={(e) => setRequestForm(prev => ({ ...prev, product_name: e.target.value }))} placeholder="e.g., Home Security Systems" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_description">Description</Label>
                  <Textarea id="product_description" value={requestForm.product_description} onChange={(e) => setRequestForm(prev => ({ ...prev, product_description: e.target.value }))} placeholder="Describe your product/service..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Input id="target_audience" value={requestForm.target_audience} onChange={(e) => setRequestForm(prev => ({ ...prev, target_audience: e.target.value }))} placeholder="e.g., Homeowners aged 35-55" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key_benefits">Key Benefits</Label>
                  <Textarea id="key_benefits" value={requestForm.key_benefits} onChange={(e) => setRequestForm(prev => ({ ...prev, key_benefits: e.target.value }))} placeholder="What are the main selling points?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="common_objections">Common Objections</Label>
                  <Textarea id="common_objections" value={requestForm.common_objections} onChange={(e) => setRequestForm(prev => ({ ...prev, common_objections: e.target.value }))} placeholder="What objections do you typically encounter?" rows={2} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scripts list — editorial cards */}
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading scripts…</div>
        ) : scripts.length === 0 ? (
          <div className="border border-dashed rounded-3xl py-20 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-6">No scripts available yet.</p>
            <Button onClick={() => setRequestDialogOpen(true)} className="rounded-full">
              Request a Custom Script
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script, idx) => {
              const accent = getPhaseAccent(idx);
              return (
                <Link
                  key={script.id}
                  to="/sales-process"
                  className="group relative flex flex-col rounded-2xl border bg-card p-7 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-foreground/20"
                >
                  <div className={`absolute top-0 left-7 right-7 h-[3px] rounded-b-full ${accent.dot} opacity-80`} />
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase ${accent.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                      {script.category || "Sales"}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {script.content?.length || 0} stages
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl leading-tight tracking-tight text-foreground mb-3">
                    {script.title}
                  </h3>
                  {script.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-8">
                      {script.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Ready to use
                    </span>
                    <span className="text-sm font-medium text-foreground inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-20 border-t pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Need something specific?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Custom scripts cover all 7 sales stages with industry-specific language and objection handling.
            </p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => setRequestDialogOpen(true)}>
            Request a script
          </Button>
        </div>
      </main>
    </div>
  );
}
