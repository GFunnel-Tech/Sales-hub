import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertOctagon,
  StickyNote,
} from "lucide-react";
import type { DispositionData } from "./PhaseDisposition";

interface PhaseActionBarProps {
  disposition: DispositionData;
  onDispositionChange: (value: DispositionData) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  phaseNumber: number;
  totalPhases: number;
  accentDot: string;
}

const STATUS_BUTTONS = [
  { value: "success",   label: "Success",   icon: CheckCircle2,  active: "bg-emerald-500 text-white border-emerald-500", idle: "text-emerald-700 dark:text-emerald-300 border-border hover:border-emerald-400" },
  { value: "follow_up", label: "Follow-up", icon: Clock,         active: "bg-amber-500 text-white border-amber-500",     idle: "text-amber-700 dark:text-amber-300 border-border hover:border-amber-400" },
  { value: "blocker",   label: "Blocker",   icon: AlertOctagon,  active: "bg-rose-500 text-white border-rose-500",       idle: "text-rose-700 dark:text-rose-300 border-border hover:border-rose-400" },
] as const;

export function PhaseActionBar({
  disposition,
  onDispositionChange,
  onPrevious,
  onNext,
  canPrev,
  canNext,
  phaseNumber,
  totalPhases,
  accentDot,
}: PhaseActionBarProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const hasNotes = disposition.notes.trim().length > 0;

  return (
    <div className="sticky bottom-4 z-30">
      <div className="rounded-2xl border bg-background/95 backdrop-blur-xl shadow-lg shadow-foreground/5 px-3 py-2.5 flex items-center gap-2 flex-wrap md:flex-nowrap">
        {/* Phase indicator */}
        <div className="hidden md:flex items-center gap-2 px-2 shrink-0">
          <span className={cn("h-2 w-2 rounded-full", accentDot)} />
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {phaseNumber}<span className="text-muted-foreground">/{totalPhases}</span>
          </span>
        </div>

        <div className="hidden md:block h-6 w-px bg-border" />

        {/* Status pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {STATUS_BUTTONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = disposition.status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  onDispositionChange({
                    ...disposition,
                    status: isActive ? "" : (opt.value as DispositionData["status"]),
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  isActive ? opt.active : cn("bg-card", opt.idle),
                )}
                aria-pressed={isActive}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:block h-6 w-px bg-border" />

        {/* Confidence stars */}
        <div className="hidden lg:flex items-center gap-2 px-1">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
            Confidence
          </span>
          <StarRating
            value={disposition.confidenceLevel}
            onChange={(level) => onDispositionChange({ ...disposition, confidenceLevel: level })}
            size="sm"
          />
        </div>

        {/* Notes */}
        <Popover open={notesOpen} onOpenChange={setNotesOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full h-9 px-3 gap-1.5">
              <StickyNote className={cn("h-4 w-4", hasNotes && "text-amber-500")} />
              <span className="hidden md:inline text-xs">
                {hasNotes ? "Notes" : "Add note"}
              </span>
              {hasNotes && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-80">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Phase notes
              </label>
              <Textarea
                autoFocus
                rows={5}
                placeholder="What happened in this phase? Anything to flag for later…"
                value={disposition.notes}
                onChange={(e) =>
                  onDispositionChange({ ...disposition, notes: e.target.value })
                }
                className="resize-none text-sm"
              />
              <div className="flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => setNotesOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Spacer */}
        <div className="flex-1 hidden md:block" />

        {/* Navigation */}
        <div className="flex items-center gap-1.5 ml-auto md:ml-0 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            disabled={!canPrev}
            className="rounded-full h-9 w-9 p-0 md:w-auto md:px-3"
            aria-label="Previous phase"
          >
            <ArrowLeft className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline text-xs">Prev</span>
          </Button>
          <Button
            size="sm"
            onClick={onNext}
            disabled={!canNext}
            className="rounded-full h-9 px-4 gap-1"
          >
            <span className="text-xs font-medium">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
