import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import type { ScriptBlock } from "@/lib/salesScriptContent";

interface ScriptDisplayProps {
  blocks: ScriptBlock[];
  prospectName?: string;
  className?: string;
  fieldValues?: Record<string, string | boolean>;
  onFieldChange?: (fieldId: string, value: string | boolean) => void;
  /** Deprecated — kept for compat. Script always renders in narrative order now. */
  grouped?: boolean;
}

const CUE_META: Record<string, { label: string; className: string }> = {
  speech:      { label: "SAY",     className: "text-primary border-primary/60" },
  question:    { label: "ASK",     className: "text-cyan-700 border-cyan-500/60 dark:text-cyan-400" },
  instruction: { label: "NOTE",    className: "text-amber-700 border-amber-500/60 dark:text-amber-400" },
  action:      { label: "DO",      className: "text-violet-700 border-violet-500/60 dark:text-violet-400" },
  capture:     { label: "CAPTURE", className: "text-emerald-700 border-emerald-500/60 dark:text-emerald-400" },
};

function Cue({ type }: { type: string }) {
  const meta = CUE_META[type] ?? CUE_META.instruction;
  return (
    <div className="md:w-20 shrink-0">
      <span
        className={cn(
          "inline-block text-[10px] font-bold tracking-[0.18em] uppercase border-l-2 pl-2 py-0.5",
          meta.className
        )}
      >
        {meta.label}
      </span>
    </div>
  );
}

export const ScriptDisplay = memo(function ScriptDisplay({
  blocks,
  prospectName = "[NAME]",
  className,
  fieldValues = {},
  onFieldChange,
}: ScriptDisplayProps) {
  const replacePlaceholders = useCallback(
    (text: string) => {
      const name = (fieldValues?.prospectName as string) || prospectName || "[NAME]";
      return text.replace(/\[NAME\]/g, name);
    },
    [fieldValues?.prospectName, prospectName]
  );

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      onFieldChange?.(fieldId, value);
    },
    [onFieldChange]
  );

  const renderBody = (block: ScriptBlock) => {
    switch (block.type) {
      case "speech":
        return (
          <p
            className={cn(
              "font-serif text-xl md:text-2xl leading-[1.55] text-foreground whitespace-pre-line",
              block.highlight && "font-semibold"
            )}
          >
            {replacePlaceholders(block.content)}
          </p>
        );

      case "question":
        return (
          <p
            className={cn(
              "font-serif italic text-xl md:text-2xl leading-[1.55] text-foreground whitespace-pre-line",
              block.highlight && "font-semibold"
            )}
          >
            {replacePlaceholders(block.content)}
          </p>
        );

      case "instruction":
        return (
          <p className="text-sm leading-relaxed text-muted-foreground italic whitespace-pre-line">
            ({replacePlaceholders(block.content)})
          </p>
        );

      case "action":
        return (
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            {block.label || block.content}
          </Button>
        );

      case "capture": {
        if (!block.fieldId) return null;
        const fieldValue = fieldValues[block.fieldId];
        return (
          <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
            <Label htmlFor={block.fieldId} className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 block">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {block.fieldType === "textarea" ? (
              <Textarea
                id={block.fieldId}
                placeholder={block.placeholder}
                value={typeof fieldValue === "string" ? fieldValue : ""}
                onChange={(e) => handleFieldChange(block.fieldId!, e.target.value)}
                className="bg-background min-h-[80px]"
              />
            ) : block.fieldType === "yesno" ? (
              <div className="flex items-center gap-2">
                <Switch
                  id={block.fieldId}
                  checked={Boolean(fieldValue)}
                  onCheckedChange={(checked) => handleFieldChange(block.fieldId!, checked)}
                />
                <span className="text-sm text-muted-foreground">{fieldValue ? "Yes" : "No"}</span>
              </div>
            ) : block.fieldType === "select" && block.options ? (
              <Select
                value={typeof fieldValue === "string" ? fieldValue : ""}
                onValueChange={(val) => handleFieldChange(block.fieldId!, val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {block.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={block.fieldId}
                placeholder={block.placeholder}
                value={typeof fieldValue === "string" ? fieldValue : ""}
                onChange={(e) => handleFieldChange(block.fieldId!, e.target.value)}
                className="bg-background"
              />
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        // Script paper feel: warm off-white, subtle ruled line on the cue column
        "rounded-lg border bg-[hsl(var(--card))] px-4 md:px-8 py-6 md:py-8",
        "[background-image:linear-gradient(to_bottom,transparent_calc(100%-1px),hsl(var(--border)/0.4)_100%)] [background-size:100%_2.25rem]",
        className
      )}
    >
      <div className="space-y-6 md:space-y-7">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6"
          >
            <Cue type={block.type} />
            <div className="flex-1 min-w-0">{renderBody(block)}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
