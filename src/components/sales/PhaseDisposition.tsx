import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

export interface DispositionData {
  confidenceLevel: number;
  status: 'success' | 'follow_up' | 'blocker' | '';
  notes: string;
  callDisposition?: string;
}

interface PhaseDispositionProps {
  value: DispositionData;
  onChange: (value: DispositionData) => void;
  className?: string;
}

const STATUS_OPTIONS = [
  {
    value: 'success',
    label: 'Completed Successfully',
    description: 'Ready for next phase',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    value: 'follow_up',
    label: 'Needs Follow-Up',
    description: 'Flag for later, but continue',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    value: 'blocker',
    label: 'Major Blocker',
    description: 'Cannot proceed',
    color: 'text-red-600 dark:text-red-400',
  },
];

export function PhaseDisposition({ value, onChange, className }: PhaseDispositionProps) {
  return (
    <div className={cn("space-y-4 p-4 rounded-lg border bg-muted/30", className)}>
      <h4 className="font-semibold text-sm">Phase Disposition</h4>
      <p className="text-xs text-muted-foreground">How did this phase go?</p>

      {/* Confidence Level */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Confidence Level</Label>
        <StarRating
          value={value.confidenceLevel}
          onChange={(level) => onChange({ ...value, confidenceLevel: level })}
          size="lg"
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Status</Label>
        <RadioGroup
          value={value.status}
          onValueChange={(status: DispositionData['status']) =>
            onChange({ ...value, status })
          }
          className="space-y-2"
        >
          {STATUS_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <Label
                htmlFor={option.value}
                className="flex flex-col cursor-pointer"
              >
                <span className={cn("text-sm font-medium", option.color)}>
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Notes (optional)</Label>
        <Textarea
          placeholder="Any additional notes about this phase..."
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          className="h-16 text-sm"
        />
      </div>
    </div>
  );
}
