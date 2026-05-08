import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Division = { name: string; category: string };

const STEPS = ["Welcome", "Company", "Divisions", "Brief", "Generate", "Done"] as const;

export default function SetupWizard() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<any>(null);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [brandPrimary, setBrandPrimary] = useState("#4f46e5");
  const [brandSecondary, setBrandSecondary] = useState("#0f172a");
  const [authMode, setAuthMode] = useState("member_id");

  const [divisions, setDivisions] = useState<Division[]>([
    { name: "Sales", category: "sales" },
  ]);

  const [whatYouSell, setWhatYouSell] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [valueProps, setValueProps] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [objections, setObjections] = useState("");
  const [tone, setTone] = useState("consultative");
  const [callType, setCallType] = useState("warm");
  const [existingScript, setExistingScript] = useState("");

  useEffect(() => {
    (async () => {
      if (!token) {
        setValidating(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke("setup-generate", {
        body: { action: "validate", token },
      });
      if (error || !data?.ok) {
        setValidToken(false);
      } else {
        setValidToken(true);
      }
      setValidating(false);
    })();
  }, [token]);

  const addDivision = () =>
    setDivisions((d) => [...d, { name: "", category: "sales" }]);
  const removeDivision = (i: number) =>
    setDivisions((d) => d.filter((_, idx) => idx !== i));
  const updateDivision = (i: number, patch: Partial<Division>) =>
    setDivisions((d) => d.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setExistingScript((s) => (s ? s + "\n\n" + text : text));
    toast({ title: "Document attached", description: file.name });
  }

  async function runGenerate() {
    setGenerating(true);
    setProgress("Spinning up your workspace…");
    try {
      const { data, error } = await supabase.functions.invoke("setup-generate", {
        body: {
          action: "generate",
          token,
          org: { authMode },
          brief: {
            companyName,
            industry,
            website,
            brandPrimary,
            brandSecondary,
            divisions: divisions.filter((d) => d.name.trim()),
            whatYouSell,
            targetCustomer,
            valueProps,
            painPoints,
            objections,
            tone,
            callType,
            existingScript,
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      setStep(5);
    } catch (e: any) {
      toast({
        title: "Generation failed",
        description: e?.message ?? "Try again",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setProgress("");
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invalid or expired link</CardTitle>
            <CardDescription>
              Ask the workspace admin to send you a fresh setup link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Script Hub Setup</h1>
            <p className="text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <Sparkles className="h-6 w-6 text-primary" />
        </div>

        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome 👋</CardTitle>
              <CardDescription>
                We'll set up your company workspace, divisions, and have AI draft
                your scripts, trainings, and dispositions in a few minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setStep(1)}>Get started</Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Company profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company name *</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Brand primary</Label>
                  <Input type="color" value={brandPrimary} onChange={(e) => setBrandPrimary(e.target.value)} />
                </div>
                <div>
                  <Label>Brand secondary</Label>
                  <Input type="color" value={brandSecondary} onChange={(e) => setBrandSecondary(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Member auth mode</Label>
                <Select value={authMode} onValueChange={setAuthMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member_id">Open access with Member ID</SelectItem>
                    <SelectItem value="email_password">Email + password</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} disabled={!companyName.trim()}>Next</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Divisions</CardTitle>
              <CardDescription>Departments that will use scripts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {divisions.map((d, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Name</Label>
                    <Input value={d.name} onChange={(e) => updateDivision(i, { name: e.target.value })} placeholder="Sales, Customer Service…" />
                  </div>
                  <div className="w-44">
                    <Label>Category</Label>
                    <Select value={d.category} onValueChange={(v) => updateDivision(i, { category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="customer_service">Customer Service</SelectItem>
                        <SelectItem value="onboarding">Onboarding / Success</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDivision(i)} disabled={divisions.length <= 1}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addDivision}>
                <Plus className="h-4 w-4 mr-1" /> Add division
              </Button>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!divisions.some((d) => d.name.trim())}>Next</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>AI brief</CardTitle>
              <CardDescription>The more context, the sharper your scripts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What do you sell or support?</Label>
                <Textarea value={whatYouSell} onChange={(e) => setWhatYouSell(e.target.value)} rows={2} />
              </div>
              <div>
                <Label>Target customer</Label>
                <Textarea value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} rows={2} />
              </div>
              <div>
                <Label>Top value propositions</Label>
                <Textarea value={valueProps} onChange={(e) => setValueProps(e.target.value)} rows={2} />
              </div>
              <div>
                <Label>Customer pain points</Label>
                <Textarea value={painPoints} onChange={(e) => setPainPoints(e.target.value)} rows={2} />
              </div>
              <div>
                <Label>Common objections</Label>
                <Textarea value={objections} onChange={(e) => setObjections(e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultative">Consultative</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Primary call type</Label>
                  <Select value={callType} onValueChange={setCallType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cold">Cold outreach</SelectItem>
                      <SelectItem value="warm">Warm / discovery</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Existing script (optional)</Label>
                <Textarea value={existingScript} onChange={(e) => setExistingScript(e.target.value)} rows={4} placeholder="Paste an existing script, or upload a doc below…" />
                <Input className="mt-2" type="file" accept=".txt,.md" onChange={handleFileUpload} />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Review</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Generate your workspace</CardTitle>
              <CardDescription>
                AI will draft scripts, trainings, and dispositions for{" "}
                <strong>{companyName}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {divisions.filter((d) => d.name.trim()).map((d, i) => (
                  <Badge key={i} variant="secondary">{d.name}</Badge>
                ))}
              </div>
              {generating ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {progress || "Generating…"}
                </div>
              ) : (
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                  <Button onClick={runGenerate}>
                    <Sparkles className="h-4 w-4 mr-2" /> Generate with AI
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 5 && result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Workspace ready
              </CardTitle>
              <CardDescription>
                Created {result.scripts?.length ?? 0} scripts across{" "}
                {result.divisions?.length ?? 0} divisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-1">
                {result.scripts?.map((s: any) => (
                  <li key={s.id}>• {s.title}</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/scripts")}>Open scripts</Button>
                <Button variant="outline" onClick={() => navigate("/admin")}>Admin panel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
