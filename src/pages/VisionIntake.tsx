import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VisionIntake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    visionTitle: "",
    description: "",
    timeframe: "",
    revenueTarget: "",
    availableHours: "",
    challenges: "",
    rawPaste: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.visionTitle || !formData.description) {
      toast({
        title: "Required fields missing",
        description: "Please fill in email, vision title, and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("https://apihub.gfunnel.com/webhook-test/e996d857-0666-4224-b63c-31ab5296b067", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          formType: "vision-intake",
          submittedAt: new Date().toISOString(),
          ...formData,
        }),
      });

      navigate("/vision-processing", { state: { visionTitle: formData.visionTitle } });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/service-hub">Service Hub</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Vision Intake</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-2">Vision Intake</p>
          <h1 className="text-3xl font-bold text-foreground mb-3">Share Your Vision</h1>
          <p className="text-muted-foreground">
            Tell us about your goals, and we'll help you break them down into actionable workflows.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-sm font-medium text-foreground">Vision Details</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm text-muted-foreground">Access Projects</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Your Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">We'll use this to connect you with your projects</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visionTitle">Vision Title *</Label>
            <Input
              id="visionTitle"
              placeholder="e.g., Scale my consulting business to $500K/year"
              value={formData.visionTitle}
              onChange={(e) => setFormData({ ...formData, visionTitle: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your vision in detail. What does success look like? What are you trying to achieve?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Input
                id="timeframe"
                placeholder="e.g., 12 months"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenueTarget">Revenue Target (Optional)</Label>
              <Input
                id="revenueTarget"
                placeholder="e.g., $500,000"
                value={formData.revenueTarget}
                onChange={(e) => setFormData({ ...formData, revenueTarget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableHours">Available Hours/Week</Label>
              <Input
                id="availableHours"
                placeholder="e.g., 40"
                value={formData.availableHours}
                onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Current Challenges</Label>
            <Textarea
              id="challenges"
              placeholder="What obstacles are you currently facing? What's consuming most of your time?"
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawPaste">Raw Paste (Optional)</Label>
            <Textarea
              id="rawPaste"
              placeholder="Paste raw data, code, notes, task lists, or any unstructured information here. AI will interpret and incorporate it into your task breakdown."
              value={formData.rawPaste}
              onChange={(e) => setFormData({ ...formData, rawPaste: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Examples: CSV data, JSON, markdown lists, meeting notes, code snippets, or freeform text
            </p>
          </div>

          <div className="space-y-2">
            <Label>Supporting Documents & Diagrams (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop files or browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOCX, TXT, draw.io diagrams, images (max 10MB each, up to 5 files)
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <strong>Note:</strong> This information will be used to intelligently decompose your vision into Chores, Projects, and Asks/Needs, all aligned with your Vision Layer.
          </p>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/service-hub")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
              {isSubmitting ? "Submitting..." : "Submit Vision →"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisionIntake;
