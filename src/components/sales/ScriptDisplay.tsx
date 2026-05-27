import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
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

const CUE_META: Record<string, { label: string; className: string; activeBg: string; activeRing: string }> = {
  speech:      { label: "SAY",     className: "text-primary border-primary/60",                                 activeBg: "bg-primary/5",        activeRing: "ring-primary/50" },
  question:    { label: "ASK",     className: "text-cyan-700 border-cyan-500/60 dark:text-cyan-400",            activeBg: "bg-cyan-500/5",       activeRing: "ring-cyan-500/50" },
  instruction: { label: "NOTE",    className: "text-amber-700 border-amber-500/60 dark:text-amber-400",         activeBg: "bg-amber-500/5",      activeRing: "ring-amber-500/50" },
  action:      { label: "DO",      className: "text-violet-700 border-violet-500/60 dark:text-violet-400",      activeBg: "bg-violet-500/5",     activeRing: "ring-violet-500/50" },
  capture:     { label: "CAPTURE", className: "text-emerald-700 border-emerald-500/60 dark:text-emerald-400",   activeBg: "bg-emerald-500/5",    activeRing: "ring-emerald-500/50" },
};

function Cue({ type, active }: { type: string; active: boolean }) {
  const meta = CUE_META[type] ?? CUE_META.instruction;
  return (
    <div className="md:w-20 shrink-0">
      <span
        className={cn(
          "inline-block text-[10px] font-bold tracking-[0.18em] uppercase border-l-2 pl-2 py-0.5 transition-all",
          meta.className,
          active && "scale-110 origin-left"
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
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Reset active block when the script changes
  useEffect(() => {
    setActiveIndex(0);
  }, [blocks]);

  const goTo = useCallback(
    (idx: number) => {
      if (!blocks.length) return;
      const next = Math.max(0, Math.min(blocks.length - 1, idx));
      setActiveIndex(next);
      // Scroll the active block into a comfortable reading position
      requestAnimationFrame(() => {
        blockRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    },
    [blocks.length]
  );

  // Keyboard shortcuts: J/↓ next, K/↑ prev, Space advances
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Don't hijack typing in inputs/textareas/selects
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "j" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

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
    <div className={cn("relative", className)}>
      <div
        className={cn(
          // Script paper feel: warm off-white, subtle ruled line on the cue column
          "rounded-lg border bg-[hsl(var(--card))] px-4 md:px-8 py-6 md:py-8",
          "[background-image:linear-gradient(to_bottom,transparent_calc(100%-1px),hsl(var(--border)/0.4)_100%)] [background-size:100%_2.25rem]"
        )}
      >
        <div className="space-y-3 md:space-y-4">
          {blocks.map((block, index) => {
            const active = index === activeIndex;
            const meta = CUE_META[block.type] ?? CUE_META.instruction;
            return (
              <button
                key={index}
                ref={(el) => (blockRefs.current[index] = el as unknown as HTMLDivElement)}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "w-full text-left rounded-lg px-2 md:px-4 py-3 md:py-4 transition-all",
                  "flex flex-col md:flex-row md:items-start gap-2 md:gap-6",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  active
                    ? cn("ring-2 shadow-sm", meta.activeBg, meta.activeRing)
                    : "opacity-60 hover:opacity-100"
                )}
                aria-current={active ? "step" : undefined}
              >
                <Cue type={block.type} active={active} />
                <div className="flex-1 min-w-0">{renderBody(block)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating cue navigator */}
      <div className="sticky bottom-4 mt-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border bg-background/95 backdrop-blur px-3 py-1.5 shadow-md">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous cue"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground min-w-[3.5rem] text-center">
            {blocks.length ? activeIndex + 1 : 0} / {blocks.length}
          </span>
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex >= blocks.length - 1}
            aria-label="Next cue"
          >
            Next
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
