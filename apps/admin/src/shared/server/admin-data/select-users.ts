import { countBy } from "es-toolkit";

import { MEMBERSHIP_STATUS, sortRows, type MembershipStatus, type TableSort } from "@/shared/lib";

import { matchesUserFilter } from "./matches-user-filter";
import { matchesUserQuery } from "./matches-user-query";
import { toUserRow, type UserRowSource } from "./to-user-row";
import type { AdminUser } from "./types";
import type { UserFilter } from "./user-filters";
import { USER_SORT_ACCESSORS, type UserSortColumn } from "./user-sort";

// 멤버십 상태를 먼저 고르고, 검색어와 칩은 그 안에서 건다. 멤버십별 건수는 검색·칩과 상관없는 전체 수다.
export function selectUsers({
  db,
  now,
  query,
  filter,
  membership = MEMBERSHIP_STATUS.active,
  sort,
}: {
  db: UserRowSource & { users: AdminUser[] };
  now: Date;
  query?: string;
  filter?: UserFilter;
  membership?: MembershipStatus;
  sort: Pick<TableSort<UserSortColumn>, "column" | "dir">;
}) {
  const counts = countBy(db.users, (user) => user.membership);
  const membershipCounts: Record<MembershipStatus, number> = {
    active: counts.active ?? 0,
    left: counts.left ?? 0,
    banned: counts.banned ?? 0,
  };
  const rows = db.users
    .filter((user) => user.membership === membership)
    .map((user) => toUserRow({ user, db, now }))
    .filter((row) => matchesUserQuery({ row, query }) && matchesUserFilter({ row, filter }));
  return {
    rows: sortRows({ rows, sort, accessors: USER_SORT_ACCESSORS }),
    membershipCounts,
  };
}
