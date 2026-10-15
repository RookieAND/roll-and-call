import "server-only";
import type { MembershipStatus, TableSort } from "@/shared/lib";
import { loadSnapshot } from "@/shared/server";

import { selectUsers } from "../model/select-users";
import type { UserFilter } from "../model/user-filters";
import type { UserSortColumn } from "../model/user-sort";

export async function listUsers(options: {
  query?: string;
  filter?: UserFilter;
  membership?: MembershipStatus;
  sort: Pick<TableSort<UserSortColumn>, "column" | "dir">;
}) {
  const db = await loadSnapshot();
  return selectUsers({ db, now: new Date(), ...options });
}
