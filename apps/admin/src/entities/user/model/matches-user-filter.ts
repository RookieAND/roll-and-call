import type { UserFilter } from "./user-filters";
import type { UserRow } from "./user-row";

const NO_SHOW_WARNING_COUNT = 2;

export function matchesUserFilter({ row, filter }: { row: UserRow; filter?: UserFilter }) {
  if (filter === "gm") return row.certifiedCount > 0;
  if (filter === "noshow") return row.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
  if (filter === "sanctioned") return row.sanctioned;
  if (filter === "recent") return row.isNew;
  return true;
}
