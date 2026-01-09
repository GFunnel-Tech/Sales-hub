import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { ScriptBlock } from "@/lib/salesScriptContent";

interface ScriptDisplayProps {
  blocks: ScriptBlock[];
  prospectName?: string;
  className?: string;
}

export function ScriptDisplay({ blocks, prospectName = "[NAME]", className }: ScriptDisplayProps) {
  const replacePlaceholders = (text: string) => {
    return text.replace(/\[NAME\]/g, prospectName || "[NAME]");
  };

  const renderBlock = (block: ScriptBlock, index: number) => {
    switch (block.type) {
      case 'speech':
        return (
          <div
            key={index}
            className={cn(
              "relative pl-4 border-l-4 py-3",
              block.highlight
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20"
            )}
          >
            <span className="absolute -left-[1px] top-2 bg-background px-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Say
            </span>
            <p
              className={cn(
                "text-lg leading-relaxed whitespace-pre-line",
                block.highlight && "font-medium"
              )}
            >
              {replacePlaceholders(block.content)}
            </p>
          </div>
        );

      case 'question':
        return (
          <div
            key={index}
            className={cn(
              "relative pl-4 border-l-4 py-3",
              block.highlight
                ? "border-cyan-500 bg-cyan-500/5"
                : "border-cyan-400/40"
            )}
          >
            <span className="absolute -left-[1px] top-2 bg-background px-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-600">
              Ask
            </span>
            <p
              className={cn(
                "text-lg leading-relaxed italic",
                block.highlight && "font-medium"
              )}
            >
              {replacePlaceholders(block.content)}
            </p>
          </div>
        );

      case 'instruction':
        return (
          <div
            key={index}
            className={cn(
              "flex items-start gap-2 py-2 px-3 rounded-md bg-muted/50 text-muted-foreground",
              block.highlight && "bg-amber-500/10 text-amber-700 dark:text-amber-400"
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-wider shrink-0 mt-0.5">
              📝
            </span>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {replacePlaceholders(block.content)}
            </p>
          </div>
        );

      case 'action':
        return (
          <div key={index} className="py-3">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {block.label || block.content}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
