import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { INDUSTRY_OPTIONS } from "@/lib/blueprintConfig";
import { ArrowRight, Shield, Users, Zap, Clock } from "lucide-react";

const trustBadges = [
  { icon: Users, label: "500+ Systems Built" },
  { icon: Zap, label: "90% Close Rate" },
  { icon: Clock, label: "30-Day Guarantee" },
  { icon: Shield, label: "Enterprise Security" },
];

export default function BlueprintHandshake() {
  const navigate = useNavigate();
  const { startSession, isLoading, hasActiveSession, session, resetSession } = useBlueprintSession();
  
  const [formData, setFormData] = useState({
    prospectName: session.prospectName || "",
    prospectEmail: session.prospectEmail || "",
    prospectCompany: session.prospectCompany || "",
    prospectIndustry: session.prospectIndustry || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prospectName.trim()) {
      newErrors.prospectName = "Prospect name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await startSession(formData);
      navigate("/blueprint/dream-state");
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleContinueSession = () => {
    navigate(`/blueprint/dream-state`);
  };

  return (
    <BlueprintLayout
      title="Welcome to Your Blueprint Session"
      subtitle="Let's create a custom plan to transform your business"
      currentPage={1}
      showBack={true}
      backPath="/"
    >
      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {trustBadges.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center p-3 rounded-lg bg-background border"
          >
            <badge.icon className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs text-center text-muted-foreground">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Resume Session Card */}
      {hasActiveSession && (
        <Card className="mb-6 border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session in Progress</p>
                <p className="text-sm text-muted-foreground">
                  Continue with {session.prospectName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetSession}>
                  Start New
                </Button>
                <Button size="sm" onClick={handleContinueSession}>
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prospect Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prospectName">Prospect Name *</Label>
                <Input
                  id="prospectName"
                  placeholder="Enter prospect's full name"
                  value={formData.prospectName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, prospectName: e.target.value }))
                  }
                  className={errors.prospectName ? "border-destructive" : ""}
                />
                {errors.prospectName && (
                  <p className="text-sm text-destructive mt-1">{errors.prospectName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="prospectEmail">Email Address</Label>
                <Input
                  id="prospectEmail"
                  type="email"
                  placeholder="prospect@company.com"
                  value={formData.prospectEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, prospectEmail: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="prospectCompany">Company Name</Label>
                <Input
                  id="prospectCompany"
                  placeholder="Company name"
                  value={formData.prospectCompany}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, prospectCompany: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="prospectIndustry">Industry</Label>
                <Select
                  value={formData.prospectIndustry}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, prospectIndustry: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Authority Statement */}
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">How this works:</strong> I'll ask you some questions to understand 
                your goals and challenges, then I'll recommend a custom plan. At the end, we'll decide 
                together if it's the right fit. Sound good?
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Starting Session..." : "Start Blueprint Session"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </BlueprintLayout>
  );
}
