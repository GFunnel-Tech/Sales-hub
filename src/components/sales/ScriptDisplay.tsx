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
}

export const ScriptDisplay = memo(function ScriptDisplay({ 
  blocks, 
  prospectName = "[NAME]", 
  className,
  fieldValues = {},
  onFieldChange,
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

      case 'capture':
        if (!block.fieldId) return null;
        const fieldValue = fieldValues[block.fieldId];
        
        return (
          <div
            key={index}
            className="py-3 px-4 rounded-lg bg-accent/30 border border-accent/50"
          >
            <Label 
              htmlFor={block.fieldId} 
              className="text-sm font-medium mb-2 block"
            >
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
                <span className="text-sm text-muted-foreground">
                  {fieldValue ? 'Yes' : 'No'}
                </span>
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
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChange={(e) => handleFieldChange(block.fieldId!, e.target.value)}
                className="bg-background"
              />
            )}
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
});
