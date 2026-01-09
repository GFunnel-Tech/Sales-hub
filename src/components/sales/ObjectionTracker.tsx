import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Objection {
  id: string;
  phaseId: string;
  whatTheySaid: string;
  objectionType: string;
  howAddressed: string;
  resolved: boolean;
}

interface ObjectionTrackerProps {
  phaseId: string;
  objections: Objection[];
  onObjectionsChange: (objections: Objection[]) => void;
}

const OBJECTION_TYPES = [
  { value: 'price', label: '💰 Price' },
  { value: 'timing', label: '⏰ Timing' },
  { value: 'authority', label: '👥 Authority' },
  { value: 'trust', label: '🤔 Trust' },
  { value: 'technical', label: '⚙️ Technical' },
  { value: 'other', label: '❓ Other' },
];

export function ObjectionTracker({ phaseId, objections, onObjectionsChange }: ObjectionTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newObjection, setNewObjection] = useState<Partial<Objection>>({
    whatTheySaid: '',
    objectionType: '',
    howAddressed: '',
    resolved: false,
  });

  const phaseObjections = objections.filter((o) => o.phaseId === phaseId);
  const objectionCount = phaseObjections.length;

  const handleAddObjection = () => {
    if (!newObjection.whatTheySaid?.trim()) return;

    const objection: Objection = {
      id: crypto.randomUUID(),
      phaseId,
      whatTheySaid: newObjection.whatTheySaid || '',
      objectionType: newObjection.objectionType || 'other',
      howAddressed: newObjection.howAddressed || '',
      resolved: newObjection.resolved || false,
    };

    onObjectionsChange([...objections, objection]);
    setNewObjection({
      whatTheySaid: '',
      objectionType: '',
      howAddressed: '',
      resolved: false,
    });
  };

  const handleRemoveObjection = (id: string) => {
    onObjectionsChange(objections.filter((o) => o.id !== id));
  };

  const handleUpdateObjection = (id: string, updates: Partial<Objection>) => {
    onObjectionsChange(
      objections.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  };

  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-orange-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="font-medium text-sm">Objection Raised?</span>
          {objectionCount > 0 && (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 dark:text-orange-300">
              {objectionCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="p-3 pt-0 space-y-4">
          {/* Existing objections */}
          {phaseObjections.map((objection) => (
            <div
              key={objection.id}
              className={cn(
                "p-3 rounded-md border",
                objection.resolved
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-orange-500/30 bg-orange-500/5"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">
                  {OBJECTION_TYPES.find((t) => t.value === objection.objectionType)?.label || objection.objectionType}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveObjection(objection.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm mb-2">"{objection.whatTheySaid}"</p>
              {objection.howAddressed && (
                <p className="text-xs text-muted-foreground mb-2">
                  Response: {objection.howAddressed}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  id={`resolved-${objection.id}`}
                  checked={objection.resolved}
                  onCheckedChange={(checked) =>
                    handleUpdateObjection(objection.id, { resolved: checked })
                  }
                />
                <Label htmlFor={`resolved-${objection.id}`} className="text-xs">
                  Resolved
                </Label>
              </div>
            </div>
          ))}

          {/* Add new objection form */}
          <div className="space-y-3 pt-2 border-t border-orange-500/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Log New Objection
            </h4>
            <div>
              <Label className="text-xs">What did they say?</Label>
              <Textarea
                placeholder="Enter their objection..."
                value={newObjection.whatTheySaid}
                onChange={(e) =>
                  setNewObjection((prev) => ({ ...prev, whatTheySaid: e.target.value }))
                }
                className="mt-1 h-16 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Objection Type</Label>
              <Select
                value={newObjection.objectionType}
                onValueChange={(value) =>
                  setNewObjection((prev) => ({ ...prev, objectionType: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {OBJECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">How did you address it?</Label>
              <Textarea
                placeholder="Your response..."
                value={newObjection.howAddressed}
                onChange={(e) =>
                  setNewObjection((prev) => ({ ...prev, howAddressed: e.target.value }))
                }
                className="mt-1 h-16 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="new-resolved"
                checked={newObjection.resolved}
                onCheckedChange={(checked) =>
                  setNewObjection((prev) => ({ ...prev, resolved: checked }))
                }
              />
              <Label htmlFor="new-resolved" className="text-xs">
                Resolved
              </Label>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddObjection}
              disabled={!newObjection.whatTheySaid?.trim()}
              className="w-full gap-2"
            >
              <Plus className="h-3 w-3" />
              Add Objection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
