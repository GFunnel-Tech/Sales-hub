// Comprehensive call disposition taxonomy for the live sales call action bar.
// Grouped by lifecycle stage. `terminal` flags whether the call ends the active cycle.

export interface DispositionOption {
  value: string;
  label: string;
  terminal?: boolean;
  next?: string;
}

export interface DispositionGroup {
  key: string;
  label: string;
  options: DispositionOption[];
}

export const DISPOSITION_GROUPS: DispositionGroup[] = [
  {
    key: "no_contact",
    label: "No Contact",
    options: [
      { value: "no_answer", label: "No Answer", next: "Auto-retry per cadence" },
      { value: "busy", label: "Busy", next: "Retry same day" },
      { value: "vm_left", label: "Voicemail – Message Left", next: "Retry + drop nurture email" },
      { value: "vm_no_message", label: "Voicemail – No Message", next: "Retry next slot" },
      { value: "bad_number", label: "Bad / Wrong Number", next: "Flag for data fix" },
      { value: "disconnected", label: "Disconnected / Invalid", terminal: true, next: "Suppress number" },
      { value: "gatekeeper", label: "Gatekeeper Block", next: "Retry alt time/channel" },
    ],
  },
  {
    key: "contact_no_engagement",
    label: "Contact, No Engagement",
    options: [
      { value: "not_interested", label: "Not Interested", terminal: true, next: "90-day nurture" },
      { value: "do_not_contact", label: "Do Not Contact", terminal: true, next: "Hard suppress (DNC)" },
      { value: "already_customer", label: "Already a Customer", terminal: true, next: "Route to AM/expansion" },
      { value: "hung_up", label: "Hung Up / Refused", next: "Single retry then nurture" },
    ],
  },
  {
    key: "active_pipeline",
    label: "Active Pipeline",
    options: [
      { value: "connected_working", label: "Connected – Working (in call)", next: "Hold on script branch" },
      { value: "discovery_qualified", label: "Discovery Completed – Qualified", next: "Advance to presentation" },
      { value: "discovery_not_qualified", label: "Discovery Completed – Not Qualified", terminal: true, next: "Disqualify / nurture" },
      { value: "presentation_deciding", label: "Presentation Given – Deciding", next: "Schedule follow-up; arm objections" },
      { value: "objection_open", label: "Objection – Open (working)", next: "Run I.A.C.E. loop" },
    ],
  },
  {
    key: "appointment",
    label: "Appointment / Scheduling",
    options: [
      { value: "appt_set", label: "Appointment Set", next: "Confirmation cadence" },
      { value: "appt_confirmed", label: "Appointment Confirmed", next: "Reminder sequence" },
      { value: "no_show", label: "No Show", next: "Re-book sequence (3 attempts)" },
      { value: "rescheduled", label: "Rescheduled", next: "Reset confirmation cadence" },
    ],
  },
  {
    key: "won",
    label: "Closed Won",
    options: [
      { value: "won_diy", label: "Won – DIY (Software)", terminal: true, next: "Onboarding (software)" },
      { value: "won_team", label: "Won – Team Empowerment", terminal: true, next: "Onboarding + training" },
      { value: "won_dfy", label: "Won – Done-For-You", terminal: true, next: "Service onboarding" },
      { value: "won_partner", label: "Won – Partner", terminal: true, next: "Partner onboarding" },
      { value: "won_agency", label: "Won – Agency", terminal: true, next: "Integration / AM" },
    ],
  },
  {
    key: "lost",
    label: "Closed Lost",
    options: [
      { value: "closed_lost", label: "Closed Lost", terminal: true, next: "Nurture or suppress by reason" },
    ],
  },
  {
    key: "nurture",
    label: "Nurture",
    options: [
      { value: "nurture_future", label: "Nurture – Future Opportunity", next: "Wake task on date" },
      { value: "nurture_long_term", label: "Nurture – Long-Term", next: "Drip + quarterly touch" },
    ],
  },
  {
    key: "post_sale",
    label: "Post-Sale / Handoff",
    options: [
      { value: "handed_onboarding", label: "Handed to Onboarding", terminal: true, next: "Trust-transfer trigger" },
      { value: "onboarding_complete", label: "Onboarding Complete", terminal: true, next: "First-win → expansion" },
    ],
  },
];

export const DISPOSITION_LOOKUP: Record<string, DispositionOption & { groupLabel: string }> =
  DISPOSITION_GROUPS.reduce((acc, group) => {
    group.options.forEach((opt) => {
      acc[opt.value] = { ...opt, groupLabel: group.label };
    });
    return acc;
  }, {} as Record<string, DispositionOption & { groupLabel: string }>);
