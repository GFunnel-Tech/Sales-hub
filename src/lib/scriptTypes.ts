// Shared types for sales scripts stored in scripts.content (jsonb)

export interface ScriptField {
  key: string;
  label: string;
  type: "text" | "boolean" | "number" | "email" | "phone" | "date";
}

export interface ScriptObjection {
  objection: string;
  response: string;
}

export interface ScriptPhase {
  name: string;
  goal?: string;
  lines: string[];
  fields?: ScriptField[];
  objections?: ScriptObjection[];
  /** Optional Blueprint route this phase maps to (e.g. "/blueprint/discovery"). */
  blueprint_path?: string;
}

export interface ScriptRecord {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  is_active: boolean;
  org_id: string | null;
  division_id: string | null;
  content: ScriptPhase[];
}

export const FIELD_TYPES: ScriptField["type"][] = [
  "text", "boolean", "number", "email", "phone", "date",
];
