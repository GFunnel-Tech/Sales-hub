import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BusinessMetrics, businessMetricsSchema } from "@/lib/schemas";
import { MetricHelpTooltip } from "./MetricHelpTooltip";
import { Calculator, RotateCcw, HelpCircle } from "lucide-react";
interface BusinessMetricsFormProps {
  onCalculate: (metrics: BusinessMetrics) => void;
}
export const BusinessMetricsForm = ({
  onCalculate
}: BusinessMetricsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm<BusinessMetrics>({
    resolver: zodResolver(businessMetricsSchema),
    defaultValues: {
      contractValue: 0,
      monthlyRecurring: 0,
      serviceDeliveryCosts: 0,
      monthlyServiceCosts: 0,
      retentionMonths: 24,
      closeRate: 20,
      estimatedCPL: 35
    }
  });
  const handleReset = () => {
    reset();
  };
  
  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Business Metrics Form</h2>
        <p className="text-sm text-muted-foreground">Configure your business metrics</p>
      </div>
    </Card>
  );
};