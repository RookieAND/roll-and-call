import "server-only";
import type { MembershipStatus, TableSort } from "@/shared/lib";

import { selectUsers } from "./select-users";
import { loadSnapshot } from "./snapshot";
import type { UserFilter } from "./user-filters";
import type { UserSortColumn } from "./user-sort";

export async function listUsers(options: {
  query?: string;
  filter?: UserFilter;
  membership?: MembershipStatus;
  sort: Pick<TableSort<UserSortColumn>, "column" | "dir">;
}) {
  const db = await loadSnapshot();
  return selectUsers({ db, now: new Date(), ...options });
}
