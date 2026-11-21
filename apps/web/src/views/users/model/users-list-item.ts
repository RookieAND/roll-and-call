import type { getServerUsersPage } from "@roll-and-call/database/profiles";

import type { MonthRankMedal } from "@/entities/badge";

type ServerUserRow = Awaited<ReturnType<typeof getServerUsersPage>>["rows"][number];

export type UsersListItem = Omit<ServerUserRow, "featuredBadges" | "joinedAt"> & {
  medals: MonthRankMedal[];
};
