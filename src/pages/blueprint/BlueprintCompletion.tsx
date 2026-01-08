import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { DISPOSITION_OPTIONS } from "@/lib/blueprintConfig";
import { CheckCircle2, Calendar, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlueprintCompletion() {
  const navigate = useNavigate();
  const { session, updateSession, completeSession, hasActiveSession, setCurrentPage, isLoading } = useBlueprintSession();
  
  const [formData, setFormData] = useState({
    recordingUrl: session.recordingUrl || "",
    agentNotes: session.agentNotes || "",
    disposition: session.disposition || "",
    followUpDate: session.followUpDate || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(9);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.disposition) {
      newErrors.disposition = "Please select a disposition";
    }
    if (formData.disposition === "follow_up" && !formData.followUpDate) {
      newErrors.followUpDate = "Please select a follow-up date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    updateSession(formData);
    
    try {
      await completeSession();
      navigate("/blueprint/success");
    } catch (error) {
      // Error handled in hook
    }
  };

  const showFollowUpDate = formData.disposition === "follow_up";

  return (
    <BlueprintLayout
      title="Complete Session"
      subtitle="Finalize and document the session"
      currentPage={9}
      backPath="/blueprint/pricing"
    >
      {/* Session Summary */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Session Summary
          </h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prospect:</span>
              <span className="font-medium">{session.prospectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company:</span>
              <span className="font-medium">{session.prospectCompany || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Plan:</span>
              <span className="font-medium capitalize">{session.selectedPlan?.replace("_", " ") || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Qualification Score:</span>
              <span className="font-medium">{session.qualificationScore}/5</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Recording URL */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Label htmlFor="recordingUrl">Recording URL (optional)</Label>
            <Input
              id="recordingUrl"
              type="url"
              placeholder="https://..."
              value={formData.recordingUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, recordingUrl: e.target.value }))}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link to the call recording (Google Meet, Zoom, etc.)
            </p>
          </CardContent>
        </Card>

        {/* Agent Notes */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Label htmlFor="agentNotes">Session Notes</Label>
            <Textarea
              id="agentNotes"
              placeholder="Document key takeaways, action items, and follow-up tasks..."
              value={formData.agentNotes}
              onChange={(e) => setFormData((prev) => ({ ...prev, agentNotes: e.target.value }))}
              className="mt-2 min-h-[120px] resize-none"
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {formData.agentNotes.length}/5000
            </p>
          </CardContent>
        </Card>

        {/* Disposition */}
        <Card className={cn("mb-4", errors.disposition && "border-destructive")}>
          <CardContent className="p-4">
            <Label>Disposition *</Label>
            <RadioGroup
              value={formData.disposition}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, disposition: value }));
                setErrors((prev) => ({ ...prev, disposition: "" }));
              }}
              className="mt-3 space-y-2"
            >
              {DISPOSITION_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                    formData.disposition === option.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setFormData((prev) => ({ ...prev, disposition: option.value }))}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className={cn("cursor-pointer font-normal", option.color)}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.disposition && (
              <p className="text-sm text-destructive mt-2">{errors.disposition}</p>
            )}
          </CardContent>
        </Card>

        {/* Follow-up Date */}
        {showFollowUpDate && (
          <Card className={cn("mb-6", errors.followUpDate && "border-destructive")}>
            <CardContent className="p-4">
              <Label htmlFor="followUpDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Follow-up Date *
              </Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, followUpDate: e.target.value }));
                  setErrors((prev) => ({ ...prev, followUpDate: "" }));
                }}
                className="mt-2"
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.followUpDate && (
                <p className="text-sm text-destructive mt-1">{errors.followUpDate}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Completing Session...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Complete Session
            </>
          )}
        </Button>
      </form>

      {/* Tip */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> Accurate disposition tracking helps measure conversion rates 
          and identify areas for improvement in your sales process.
        </p>
      </div>
    </BlueprintLayout>
  );
}
