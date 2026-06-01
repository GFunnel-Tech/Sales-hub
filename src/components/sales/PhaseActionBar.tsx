import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertOctagon,
  StickyNote,
  PhoneCall,
} from "lucide-react";
import type { DispositionData } from "./PhaseDisposition";
import { DISPOSITION_GROUPS, DISPOSITION_LOOKUP } from "@/lib/callDispositions";


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
  phases: { id: string; title: string }[];
  currentPhaseIndex: number;
  completedPhases: number[];
  onSelectPhase: (index: number) => void;
}


const STATUS_BUTTONS = [
  { value: "success",   label: "Success",   description: "Phase completed successfully — prospect met the objective and is advancing.", icon: CheckCircle2,  active: "bg-emerald-500 text-white border-emerald-500", idle: "text-emerald-700 dark:text-emerald-300 border-border hover:border-emerald-400" },
  { value: "follow_up", label: "Follow-up", description: "Needs a follow-up action — scheduling, sending info, or re-engagement later.", icon: Clock,         active: "bg-amber-500 text-white border-amber-500",     idle: "text-amber-700 dark:text-amber-300 border-border hover:border-amber-400" },
  { value: "blocker",   label: "Blocker",   description: "A blocker or objection is preventing progress — needs resolution to continue.", icon: AlertOctagon,  active: "bg-rose-500 text-white border-rose-500",       idle: "text-rose-700 dark:text-rose-300 border-border hover:border-rose-400" },
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
  phases,
  currentPhaseIndex,
  completedPhases,
  onSelectPhase,
}: PhaseActionBarProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [phasesOpen, setPhasesOpen] = useState(false);
  const hasNotes = disposition.notes.trim().length > 0;
  const currentDispo = disposition.callDisposition
    ? DISPOSITION_LOOKUP[disposition.callDisposition]
    : undefined;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-xl shadow-[0_-4px_24px_-12px_hsl(var(--foreground)/0.15)]">
      <div className="mx-auto w-full px-4 md:px-6 py-2.5 flex items-center gap-2 flex-wrap md:flex-nowrap">
        {/* Phase indicator with pull-up stages list */}
        <Popover open={phasesOpen} onOpenChange={setPhasesOpen}>
          <PopoverTrigger asChild>
            <button
              className="hidden md:inline-flex items-center gap-2 px-2.5 h-9 rounded-full border border-border bg-card hover:border-foreground/30 transition-colors shrink-0"
              aria-label="Show all phases"
            >
              <span className={cn("h-2 w-2 rounded-full", accentDot)} />
              <span className="text-xs font-semibold tabular-nums text-foreground">
                {phaseNumber}<span className="text-muted-foreground">/{totalPhases}</span>
              </span>
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-80 p-2">
            <div className="px-2 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sales Phases
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-0.5">
              {phases.map((p, idx) => {
                const isCurrent = idx === currentPhaseIndex;
                const isCompleted = completedPhases.includes(idx);
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPhase(idx);
                      setPhasesOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                      isCurrent
                        ? "bg-foreground text-background"
                        : "hover:bg-muted text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 shrink-0 rounded-full text-[10px] font-semibold inline-flex items-center justify-center tabular-nums",
                        isCurrent
                          ? "bg-background/20 text-background"
                          : isCompleted
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isCompleted && !isCurrent ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                    </span>
                    <span className="text-sm font-medium truncate flex-1">{p.title}</span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block h-6 w-px bg-border" />


        {/* Call Disposition Dropdown */}
        <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-none md:w-72">
          <PhoneCall className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
          <Select
            value={disposition.callDisposition || ""}
            onValueChange={(value) =>
              onDispositionChange({ ...disposition, callDisposition: value })
            }
          >
            <SelectTrigger className="h-9 rounded-full text-xs w-full">
              <SelectValue placeholder="Set call disposition…">
                {currentDispo && (
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {currentDispo.groupLabel}
                    </span>
                    <span className="truncate">{currentDispo.label}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[60vh]">
              {DISPOSITION_GROUPS.map((group) => (
                <SelectGroup key={group.key}>
                  <SelectLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </SelectLabel>
                  {group.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span>{opt.label}</span>
                        {opt.terminal && (
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">terminal</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden lg:block h-6 w-px bg-border" />

        {/* Status pills */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <TooltipProvider delayDuration={200}>
            {STATUS_BUTTONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = disposition.status === opt.value;
              return (
                <Tooltip key={opt.value}>
                  <TooltipTrigger asChild>
                    <button
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
                      <span className="hidden xl:inline">{opt.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
                    {opt.description}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        <div className="hidden xl:block h-6 w-px bg-border" />

        {/* Confidence stars */}
        <div className="hidden xl:flex items-center gap-2 px-1">
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
