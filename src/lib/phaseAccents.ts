// Color-coded accents for sales script phases (editorial / minimal).
// Indexed by phase position; cycles if more phases than colors.

export interface PhaseAccent {
  key: string;
  /** Tailwind text class for label/icon */
  text: string;
  /** Tailwind bg class for soft tinted surface (very subtle) */
  surface: string;
  /** Tailwind border class for left rail / accent stripe */
  rail: string;
  /** Tailwind dot bg class */
  dot: string;
  /** Tailwind ring class for active state */
  ring: string;
}

export const PHASE_ACCENTS: PhaseAccent[] = [
  { key: "sky",     text: "text-sky-700 dark:text-sky-300",        surface: "bg-sky-50/60 dark:bg-sky-950/20",        rail: "border-sky-400",       dot: "bg-sky-500",       ring: "ring-sky-400/40" },
  { key: "rose",    text: "text-rose-700 dark:text-rose-300",      surface: "bg-rose-50/60 dark:bg-rose-950/20",      rail: "border-rose-400",      dot: "bg-rose-500",      ring: "ring-rose-400/40" },
  { key: "amber",   text: "text-amber-700 dark:text-amber-300",    surface: "bg-amber-50/60 dark:bg-amber-950/20",    rail: "border-amber-400",     dot: "bg-amber-500",     ring: "ring-amber-400/40" },
  { key: "emerald", text: "text-emerald-700 dark:text-emerald-300",surface: "bg-emerald-50/60 dark:bg-emerald-950/20",rail: "border-emerald-400",   dot: "bg-emerald-500",   ring: "ring-emerald-400/40" },
  { key: "violet",  text: "text-violet-700 dark:text-violet-300",  surface: "bg-violet-50/60 dark:bg-violet-950/20",  rail: "border-violet-400",    dot: "bg-violet-500",     ring: "ring-violet-400/40" },
  { key: "cyan",    text: "text-cyan-700 dark:text-cyan-300",      surface: "bg-cyan-50/60 dark:bg-cyan-950/20",      rail: "border-cyan-400",      dot: "bg-cyan-500",       ring: "ring-cyan-400/40" },
  { key: "fuchsia", text: "text-fuchsia-700 dark:text-fuchsia-300",surface: "bg-fuchsia-50/60 dark:bg-fuchsia-950/20",rail: "border-fuchsia-400",   dot: "bg-fuchsia-500",    ring: "ring-fuchsia-400/40" },
  { key: "slate",   text: "text-slate-700 dark:text-slate-300",    surface: "bg-slate-50 dark:bg-slate-900/40",       rail: "border-slate-400",     dot: "bg-slate-500",      ring: "ring-slate-400/40" },
];

export const getPhaseAccent = (index: number): PhaseAccent =>
  PHASE_ACCENTS[index % PHASE_ACCENTS.length];
