import { z } from "zod";

export const businessMetricsSchema = z.object({
  contractValue: z.number().min(0, "Contract value must be positive"),
  monthlyRecurring: z.number().min(0, "Monthly recurring must be positive"),
  serviceDeliveryCosts: z.number().min(0, "Service delivery costs must be positive"),
  monthlyServiceCosts: z.number().min(0, "Monthly service costs must be positive"),
  retentionMonths: z.number().min(1, "Retention must be at least 1 month").max(600, "Maximum 600 months"),
  closeRate: z.number().min(1, "Close rate must be at least 1%").max(100, "Close rate cannot exceed 100%"),
  estimatedCPL: z.number().min(0, "CPL must be positive").optional()
});

export type BusinessMetrics = z.infer<typeof businessMetricsSchema>;
