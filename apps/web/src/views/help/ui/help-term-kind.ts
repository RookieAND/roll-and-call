import type { HelpTerm } from "../model/help-docs";

export function helpTermKind(row: HelpTerm) {
  if (row.status) return "status";
  if (row.badge) return "badge";
  return "text";
}
