import type { getServerUsersPage } from "@roll-and-call/database/profiles";

import type { MonthRankMedal } from "@/entities/badge";

type ServerUserRow = Awaited<ReturnType<typeof getServerUsersPage>>["rows"][number];

export type UsersListItem = Omit<ServerUserRow, "featuredBadges" | "joinedAt"> & {
  // month는 메달 칩에 붙이는 달 표시(「11월」)다.
  medals: (MonthRankMedal & { month: string })[];
};
