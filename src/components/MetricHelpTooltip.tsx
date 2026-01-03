import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { metricDefinitions } from "@/lib/industryPresets";

interface MetricHelpTooltipProps {
  metricKey: keyof typeof metricDefinitions;
}

export const MetricHelpTooltip = ({ metricKey }: MetricHelpTooltipProps) => {
  const metric = metricDefinitions[metricKey];

  if (!metric) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Help for ${metric.title}`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4" side="right">
          <div className="space-y-2">
            <p className="font-semibold text-sm text-foreground">{metric.title}</p>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            {metric.formula && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-foreground">Formula:</p>
                <p className="text-xs text-muted-foreground font-mono">{metric.formula}</p>
              </div>
            )}
            {metric.example && (
              <div className="pt-1">
                <p className="text-xs font-medium text-foreground">Example:</p>
                <p className="text-xs text-muted-foreground">{metric.example}</p>
              </div>
            )}
            {metric.benchmark && (
              <div className="pt-1">
                <p className="text-xs font-medium text-foreground">Benchmark:</p>
                <p className="text-xs text-muted-foreground">{metric.benchmark}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
