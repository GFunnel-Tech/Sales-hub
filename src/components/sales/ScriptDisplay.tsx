import { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageSquare, HelpCircle, ClipboardList, FileInput } from "lucide-react";
import type { ScriptBlock } from "@/lib/salesScriptContent";

interface ScriptDisplayProps {
  blocks: ScriptBlock[];
  prospectName?: string;
  className?: string;
  fieldValues?: Record<string, string | boolean>;
  onFieldChange?: (fieldId: string, value: string | boolean) => void;
  /** When true (default) groups blocks into collapsible sections by type. */
  grouped?: boolean;
}

type SectionKey = "say" | "ask" | "do" | "capture";

const SECTION_META: Record<
  SectionKey,
  { label: string; icon: typeof MessageSquare; accent: string }
> = {
  say: { label: "Say", icon: MessageSquare, accent: "text-primary" },
  ask: { label: "Ask", icon: HelpCircle, accent: "text-cyan-600" },
  do: { label: "Do", icon: ClipboardList, accent: "text-amber-600" },
  capture: { label: "Capture", icon: FileInput, accent: "text-emerald-600" },
};

const SECTION_ORDER: SectionKey[] = ["say", "ask", "do", "capture"];

const blockSection = (b: ScriptBlock): SectionKey => {
  switch (b.type) {
    case "speech": return "say";
    case "question": return "ask";
    case "instruction":
    case "action": return "do";
    case "capture": return "capture";
    default: return "do";
  }
};

export const ScriptDisplay = memo(function ScriptDisplay({
  blocks,
  prospectName = "[NAME]",
  className,
  fieldValues = {},
  onFieldChange,
  grouped = true,
}: ScriptDisplayProps) {
  const replacePlaceholders = useCallback((text: string) => {
    const name = (fieldValues?.prospectName as string) || prospectName || "[NAME]";
    return text.replace(/\[NAME\]/g, name);
  }, [fieldValues?.prospectName, prospectName]);

  const handleFieldChange = useCallback((fieldId: string, value: string | boolean) => {
    onFieldChange?.(fieldId, value);
  }, [onFieldChange]);

  const renderBlock = (block: ScriptBlock, index: number) => {
    switch (block.type) {
      case 'speech':
        return (
          <div
            key={index}
            className={cn(
              "relative pl-4 border-l-4 py-3",
              block.highlight ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            )}
          >
            <p className={cn("text-base leading-relaxed whitespace-pre-line", block.highlight && "font-medium")}>
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
              block.highlight ? "border-cyan-500 bg-cyan-500/5" : "border-cyan-400/40"
            )}
          >
            <p className={cn("text-base leading-relaxed italic", block.highlight && "font-medium")}>
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
            <span className="text-xs shrink-0 mt-0.5">📝</span>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {replacePlaceholders(block.content)}
            </p>
          </div>
        );

      case 'action':
        return (
          <div key={index} className="py-2">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {block.label || block.content}
            </Button>
          </div>
        );

      case 'capture': {
        if (!block.fieldId) return null;
        const fieldValue = fieldValues[block.fieldId];
        return (
          <div key={index} className="py-3 px-4 rounded-lg bg-accent/30 border border-accent/50">
            <Label htmlFor={block.fieldId} className="text-sm font-medium mb-2 block">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {block.fieldType === 'textarea' ? (
              <Textarea
                id={block.fieldId}
                placeholder={block.placeholder}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChange={(e) => handleFieldChange(block.fieldId!, e.target.value)}
                className="bg-background min-h-[80px]"
              />
            ) : block.fieldType === 'yesno' ? (
              <div className="flex items-center gap-2">
                <Switch
                  id={block.fieldId}
                  checked={Boolean(fieldValue)}
                  onCheckedChange={(checked) => handleFieldChange(block.fieldId!, checked)}
                />
                <span className="text-sm text-muted-foreground">{fieldValue ? 'Yes' : 'No'}</span>
              </div>
            ) : block.fieldType === 'select' && block.options ? (
              <Select
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onValueChange={(val) => handleFieldChange(block.fieldId!, val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {block.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={block.fieldId}
                placeholder={block.placeholder}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
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

  const sections = useMemo(() => {
    const map: Record<SectionKey, { block: ScriptBlock; index: number }[]> = {
      say: [], ask: [], do: [], capture: [],
    };
    blocks.forEach((b, i) => map[blockSection(b)].push({ block: b, index: i }));
    return map;
  }, [blocks]);

  if (!grouped) {
    return (
      <div className={cn("space-y-4", className)}>
        {blocks.map((b, i) => renderBlock(b, i))}
      </div>
    );
  }

  const activeSections = SECTION_ORDER.filter((k) => sections[k].length > 0);

  return (
    <Accordion
      type="multiple"
      defaultValue={activeSections}
      className={cn("space-y-2", className)}
    >
      {activeSections.map((key) => {
        const meta = SECTION_META[key];
        const Icon = meta.icon;
        const items = sections[key];
        return (
          <AccordionItem
            key={key}
            value={key}
            className="border border-border rounded-lg px-3 bg-card/40"
          >
            <AccordionTrigger className="py-2.5 hover:no-underline">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", meta.accent)} />
                <span className="text-sm font-semibold uppercase tracking-wider">{meta.label}</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {items.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="space-y-3">
                {items.map(({ block, index }) => renderBlock(block, index))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
});
