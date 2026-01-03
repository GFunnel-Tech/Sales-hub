import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
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
    
    if (!user) {
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
          user_id: user.id,
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
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Script Library</h1>
            <p className="text-muted-foreground">Browse sales scripts or request a custom one</p>
          </div>
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
                  <Input
                    id="product_name"
                    value={requestForm.product_name}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, product_name: e.target.value }))}
                    placeholder="e.g., Home Security Systems"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_description">Description</Label>
                  <Textarea
                    id="product_description"
                    value={requestForm.product_description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, product_description: e.target.value }))}
                    placeholder="Describe your product/service..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Input
                    id="target_audience"
                    value={requestForm.target_audience}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, target_audience: e.target.value }))}
                    placeholder="e.g., Homeowners aged 35-55"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key_benefits">Key Benefits</Label>
                  <Textarea
                    id="key_benefits"
                    value={requestForm.key_benefits}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, key_benefits: e.target.value }))}
                    placeholder="What are the main selling points?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="common_objections">Common Objections</Label>
                  <Textarea
                    id="common_objections"
                    value={requestForm.common_objections}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, common_objections: e.target.value }))}
                    placeholder="What objections do you typically encounter?"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setRequestDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scripts Grid */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading scripts...</p>
            </CardContent>
          </Card>
        ) : scripts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No scripts available yet.</p>
              <Button onClick={() => setRequestDialogOpen(true)}>
                Request a Custom Script
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <Card key={script.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    {script.category && (
                      <Badge variant="outline">{script.category}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3">{script.title}</CardTitle>
                  {script.description && (
                    <CardDescription>{script.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{script.content?.length || 0} stages</span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/sales-process">Use This Script</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Need a Custom Script?</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Our team can create a tailored sales script for your specific product or service. 
                  Click "Request Custom Script" above and provide details about your offering.
                </p>
                <p className="text-blue-700 text-xs">
                  Custom scripts typically include all 7 sales stages with industry-specific language and objection handling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
