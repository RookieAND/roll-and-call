import type { UsersListItem } from "./users-list-item";

export interface UsersPage {
  rows: UsersListItem[];
  total: number;
}
