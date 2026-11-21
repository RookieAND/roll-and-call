import { type ServerUserSort } from "@roll-and-call/database/profiles/model";

export interface UsersFilter {
  q?: string;
  cert?: string;
  host?: string;
  recruiting: boolean;
  sort: ServerUserSort;
}
