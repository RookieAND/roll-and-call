import {
  playedCountsByUser,
  recentNoShowCountsByUser,
} from "@roll-and-call/database/moderation/model";
import { countBy, groupBy } from "es-toolkit";

import { MEMBERSHIP_STATUS, sortRows, type MembershipStatus, type TableSort } from "@/shared/lib";
import type { AdminShapes } from "@/shared/server";

import { matchesUserFilter } from "./matches-user-filter";
import { matchesUserQuery } from "./matches-user-query";
import { toUserRow } from "./to-user-row";
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
  db: Pick<
    AdminShapes,
    "users" | "countingSessions" | "countingNoShows" | "certifiedUserIds" | "nicknameEdits"
  >;
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
  const members = db.users.filter((user) => user.membership === membership);
  const userIds = members.map((user) => user.id);
  const played = playedCountsByUser({
    sessions: db.countingSessions,
    noShows: db.countingNoShows,
    now,
    userIds,
  });
  const recentNoShows = recentNoShowCountsByUser({
    sessions: db.countingSessions,
    noShows: db.countingNoShows,
    now,
    userIds,
  });
  const certified = countBy(db.certifiedUserIds, (userId) => userId);
  const previousNicknames = groupBy(db.nicknameEdits, (edit) => edit.userId);
  const rows = members
    .map((user) =>
      toUserRow({
        user,
        now,
        playedCount: played.get(user.id) ?? 0,
        recentNoShowCount: recentNoShows.get(user.id) ?? 0,
        certifiedCount: certified[user.id] ?? 0,
        previousNicknames: (previousNicknames[user.id] ?? []).map((edit) => edit.previousNickname),
      }),
    )
    .filter((row) => matchesUserQuery({ row, query }) && matchesUserFilter({ row, filter }));
  return {
    rows: sortRows({ rows, sort, accessors: USER_SORT_ACCESSORS }),
    membershipCounts,
  };
}
