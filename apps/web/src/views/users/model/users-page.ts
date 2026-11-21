import type { MemberTitleSheet } from "@/features/view-badge";

import type { UsersListItem } from "./users-list-item";

export interface UsersPage {
  rows: UsersListItem[];
  total: number;
  titleSheets: Record<string, MemberTitleSheet>;
}
