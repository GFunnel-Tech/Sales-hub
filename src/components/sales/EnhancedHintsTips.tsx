import { Lightbulb, CheckCircle2, XCircle, Target, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhaseHints } from "@/lib/salesScriptContent";

interface EnhancedHintsTipsProps {
  hints: PhaseHints;
  className?: string;
}

export function EnhancedHintsTips({ hints, className }: EnhancedHintsTipsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        <span>Hints & Tips</span>
      </div>

      {/* DO's */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3" />
          <span>Do</span>
        </div>
        <ul className="space-y-1">
          {hints.dos.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* DON'Ts */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
          <XCircle className="h-3 w-3" />
          <span>Don't</span>
        </div>
        <ul className="space-y-1">
          {hints.donts.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-red-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Listen For */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          <Target className="h-3 w-3" />
          <span>Listen For</span>
        </div>
        <ul className="space-y-1">
          {hints.listenFor.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-cyan-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Common Mistake */}
      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Common Mistake</span>
        </div>
        <p className="text-sm text-muted-foreground">{hints.commonMistake}</p>
      </div>

      {/* Power Move */}
      {hints.powerMove && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Zap className="h-3 w-3" />
            <span>Power Move</span>
          </div>
          <p className="text-sm font-medium italic">"{hints.powerMove}"</p>
        </div>
      )}
    </div>
  );
}
