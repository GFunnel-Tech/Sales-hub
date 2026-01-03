import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { ServiceConfig } from "@/lib/serviceConfigs";
import { getFormFieldsForService } from "@/lib/serviceFormFields";

interface ServiceIntakeFormProps {
  service: ServiceConfig;
}

const WEBHOOK_URL = "https://apihub.gfunnel.com/webhook-test/e996d857-0666-4224-b63c-31ab5296b067";

export const ServiceIntakeForm = ({ service }: ServiceIntakeFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get service-specific form fields
  const serviceFields = getFormFieldsForService(service.slug);
  
  // Base form data + dynamic fields
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
    companyName: "",
    budget: "",
    timeline: "",
    goals: "",
    currentChallenges: "",
    additionalInfo: "",
  });

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.goals) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your email and project goals.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          // Form identification for n8n routing
          form_type: `service_intake_${service.slug}`,
          form_category: "service_intake",
          
          // Service details
          service_name: service.name,
          service_slug: service.slug,
          
          // Metadata
          submitted_at: new Date().toISOString(),
          source_url: window.location.href,
          
          // Form data
          ...formData,
        }),
      });

      toast({
        title: "Request submitted!",
        description: "Redirecting to your confirmation...",
      });

      // Navigate to confirmation page
      navigate("/service-confirmation", {
        state: {
          serviceName: service.name,
          serviceSlug: service.slug,
        },
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: { name: string; label: string; type: string; placeholder?: string; options?: { value: string; label: string }[]; required?: boolean }) => {
    if (field.type === "select" && field.options) {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={2}
          />
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          id={field.name}
          placeholder={field.placeholder}
          value={formData[field.name] || ""}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
        />
      </div>
    );
  };

  return (
    <Card className="p-6" id="intake-form">
      <h3 className="text-lg font-semibold mb-4">Get Started with {service.name}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <div className="space-y-2">
          <Label htmlFor="email">Your Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Your company name"
            value={formData.companyName}
            onChange={(e) => handleFieldChange("companyName", e.target.value)}
          />
        </div>

        {/* Service-Specific Fields */}
        {serviceFields.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Tell us more about your {service.name} needs:
            </p>
            <div className="space-y-4">
              {serviceFields.map((field) => renderField(field))}
            </div>
          </div>
        )}

        {/* Budget and Timeline */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget</Label>
            <Select
              value={formData.budget}
              onValueChange={(value) => handleFieldChange("budget", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1k">Under $1,000</SelectItem>
                <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                <SelectItem value="25k-plus">$25,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => handleFieldChange("timeline", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="When to start" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">ASAP</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="next-month">Next month</SelectItem>
                <SelectItem value="next-quarter">Next quarter</SelectItem>
                <SelectItem value="exploring">Just exploring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Goals and Challenges */}
        <div className="space-y-2">
          <Label htmlFor="goals">What are your goals? *</Label>
          <Textarea
            id="goals"
            placeholder="Describe what you're trying to achieve..."
            value={formData.goals}
            onChange={(e) => handleFieldChange("goals", e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentChallenges">Current Challenges</Label>
          <Textarea
            id="currentChallenges"
            placeholder="What obstacles are you facing?"
            value={formData.currentChallenges}
            onChange={(e) => handleFieldChange("currentChallenges", e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Anything else we should know?"
            value={formData.additionalInfo}
            onChange={(e) => handleFieldChange("additionalInfo", e.target.value)}
            rows={2}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          We'll respond within 24 hours. No spam, ever.
        </p>
      </form>
    </Card>
  );
};
