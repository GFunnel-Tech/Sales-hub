import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMember } from "@/hooks/useMember";
import { memberApi } from "@/lib/memberApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Phone, MapPin, DollarSign, FileText, Calendar } from "lucide-react";

type DispositionType = "sold" | "no_sale" | "callback" | "no_answer" | "not_interested" | "needs_followup" | "sent_info" | "scheduled_demo" | "left_voicemail";
type SalesStage = "handshake_authority" | "dream_pain_bridge" | "discovery" | "presentation" | "ask_objections" | "ask_order" | "handoff";

const dispositions: { value: DispositionType; label: string }[] = [
  { value: "sold", label: "Sold" },
  { value: "no_sale", label: "No Sale" },
  { value: "callback", label: "Callback Scheduled" },
  { value: "no_answer", label: "No Answer" },
  { value: "not_interested", label: "Not Interested" },
  { value: "needs_followup", label: "Needs Follow-up" },
  { value: "sent_info", label: "Sent Info" },
  { value: "scheduled_demo", label: "Scheduled Demo" },
  { value: "left_voicemail", label: "Left Voicemail" }
];

const salesStages: { value: SalesStage; label: string }[] = [
  { value: "handshake_authority", label: "Handshake/Authority" },
  { value: "dream_pain_bridge", label: "Dream/Pain/Bridge" },
  { value: "discovery", label: "Discovery" },
  { value: "presentation", label: "Presentation" },
  { value: "ask_objections", label: "Ask for Objections" },
  { value: "ask_order", label: "Ask for Order" },
  { value: "handoff", label: "Handoff" }
];

const callTypes = [
  { value: "phone", label: "Phone Call" },
  { value: "webinar", label: "Webinar" },
  { value: "live_meeting", label: "Live Meeting (Google Meet)" }
];

export default function LogSale() {
  const { member } = useMember();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_city: "",
    customer_state: "",
    customer_zip: "",
    product_service: "",
    sale_amount: "",
    disposition: "" as DispositionType | "",
    closed_at_stage: "" as SalesStage | "",
    call_type: "",
    call_duration_minutes: "",
    notes: "",
    objections_handled: "",
    follow_up_date: "",
    follow_up_notes: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Error",
        description: "You must be logged in to log a sale.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.customer_first_name || !formData.product_service || !formData.disposition) {
      toast({
        title: "Missing required fields",
        description: "Please fill in customer name, product/service, and disposition.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const saleData = {
        customer_first_name: formData.customer_first_name,
        customer_last_name: formData.customer_last_name || null,
        customer_email: formData.customer_email || null,
        customer_phone: formData.customer_phone || null,
        customer_address: formData.customer_address || null,
        customer_city: formData.customer_city || null,
        customer_state: formData.customer_state || null,
        customer_zip: formData.customer_zip || null,
        product_service: formData.product_service,
        sale_amount: formData.sale_amount ? parseFloat(formData.sale_amount) : null,
        disposition: formData.disposition as DispositionType,
        closed_at_stage: formData.closed_at_stage ? formData.closed_at_stage as SalesStage : null,
        call_type: formData.call_type || null,
        call_duration_minutes: formData.call_duration_minutes ? parseInt(formData.call_duration_minutes) : null,
        notes: formData.notes || null,
        objections_handled: formData.objections_handled || null,
        follow_up_date: formData.follow_up_date ? new Date(formData.follow_up_date).toISOString() : null,
        follow_up_notes: formData.follow_up_notes || null,
      };

      await memberApi.createSale(saleData);

      toast({
        title: "Sale logged!",
        description: "Your sale/activity has been recorded successfully."
      });

      navigate("/my-sales");
    } catch (error: any) {
      console.error("Error logging sale:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to log sale. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">Log Sale / Activity</h1>
            <p className="text-muted-foreground">Record a new sale or customer interaction</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_first_name">First Name *</Label>
                    <Input
                      id="customer_first_name"
                      value={formData.customer_first_name}
                      onChange={(e) => handleChange("customer_first_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_last_name">Last Name</Label>
                    <Input
                      id="customer_last_name"
                      value={formData.customer_last_name}
                      onChange={(e) => handleChange("customer_last_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => handleChange("customer_email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone</Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => handleChange("customer_phone", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_address">Street Address</Label>
                    <Input
                      id="customer_address"
                      value={formData.customer_address}
                      onChange={(e) => handleChange("customer_address", e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_city">City</Label>
                      <Input
                        id="customer_city"
                        value={formData.customer_city}
                        onChange={(e) => handleChange("customer_city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_state">State</Label>
                      <Input
                        id="customer_state"
                        value={formData.customer_state}
                        onChange={(e) => handleChange("customer_state", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_zip">ZIP Code</Label>
                      <Input
                        id="customer_zip"
                        value={formData.customer_zip}
                        onChange={(e) => handleChange("customer_zip", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sale Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Sale Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_service">Product/Service *</Label>
                    <Input
                      id="product_service"
                      value={formData.product_service}
                      onChange={(e) => handleChange("product_service", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale_amount">Sale Amount ($)</Label>
                    <Input
                      id="sale_amount"
                      type="number"
                      step="0.01"
                      value={formData.sale_amount}
                      onChange={(e) => handleChange("sale_amount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disposition">Disposition *</Label>
                    <Select
                      value={formData.disposition}
                      onValueChange={(value) => handleChange("disposition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        {dispositions.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closed_at_stage">Closed at Stage</Label>
                    <Select
                      value={formData.closed_at_stage}
                      onValueChange={(value) => handleChange("closed_at_stage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesStages.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Call Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="call_type">Call Type</Label>
                    <Select
                      value={formData.call_type}
                      onValueChange={(value) => handleChange("call_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {callTypes.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="call_duration_minutes">Duration (minutes)</Label>
                    <Input
                      id="call_duration_minutes"
                      type="number"
                      value={formData.call_duration_minutes}
                      onChange={(e) => handleChange("call_duration_minutes", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Notes & Objections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      rows={3}
                      placeholder="General notes about the call..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objections_handled">Objections Handled</Label>
                    <Textarea
                      id="objections_handled"
                      value={formData.objections_handled}
                      onChange={(e) => handleChange("objections_handled", e.target.value)}
                      rows={3}
                      placeholder="What objections came up and how did you handle them?"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Follow-up
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="follow_up_date">Follow-up Date</Label>
                    <Input
                      id="follow_up_date"
                      type="datetime-local"
                      value={formData.follow_up_date}
                      onChange={(e) => handleChange("follow_up_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="follow_up_notes">Follow-up Notes</Label>
                    <Textarea
                      id="follow_up_notes"
                      value={formData.follow_up_notes}
                      onChange={(e) => handleChange("follow_up_notes", e.target.value)}
                      rows={2}
                      placeholder="What to discuss on follow-up..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Log Sale
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
