export const DOCUMENT_CATEGORIES = [
  { value: "agreements", label: "Agreements" },
  { value: "sales_training", label: "Sales Training" },
  { value: "employee_handbook", label: "Employee Handbook" },
  { value: "policies", label: "Policies" },
  { value: "compliance", label: "Compliance" },
  { value: "general", label: "General" },
] as const;

export const getCategoryLabel = (value: string) =>
  DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label || value;
