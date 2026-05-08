import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Invite = {
  id: string;
  token: string;
  label: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export default function SetupInvites() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [label, setLabel] = useState("");
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("setup_invites")
      .select("*")
      .order("created_at", { ascending: false });
    setInvites((data as Invite[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    setLoading(true);
    const token = crypto.randomUUID().replace(/-/g, "");
    const { data: { user } } = await supabase.auth.getUser();
    const expires_at = days > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null;
    const { error } = await supabase.from("setup_invites").insert({
      token,
      label: label.trim() || null,
      created_by: user?.id,
      expires_at,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setLabel("");
    load();
  }

  function linkFor(token: string) {
    return `${window.location.origin}/setup/${token}`;
  }

  function copy(token: string) {
    navigator.clipboard.writeText(linkFor(token));
    toast({ title: "Copied", description: "Setup link copied to clipboard" });
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Setup invite links</CardTitle>
            <CardDescription>
              Anyone with the link can run the AI-powered setup wizard once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2">
                <Label>Label (optional)</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Acme Corp onboarding" />
              </div>
              <div>
                <Label>Expires in (days, 0 = never)</Label>
                <Input type="number" value={days} onChange={(e) => setDays(parseInt(e.target.value || "0"))} />
              </div>
            </div>
            <Button onClick={create} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" /> Create link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invites.length === 0 && (
              <p className="text-sm text-muted-foreground">No links yet.</p>
            )}
            {invites.map((inv) => (
              <div key={inv.id} className="border rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{inv.label ?? "Untitled"}</div>
                    <div className="text-xs text-muted-foreground">
                      {inv.used_at
                        ? `Used ${new Date(inv.used_at).toLocaleString()}`
                        : inv.expires_at
                        ? `Expires ${new Date(inv.expires_at).toLocaleDateString()}`
                        : "Never expires"}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copy(inv.token)} disabled={!!inv.used_at}>
                    <Copy className="h-4 w-4 mr-1" /> Copy link
                  </Button>
                </div>
                <code className="block text-xs text-muted-foreground truncate">
                  {linkFor(inv.token)}
                </code>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
