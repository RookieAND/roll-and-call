import type { getServerUsersPage } from "@roll-and-call/database/profiles";

type ServerUserRow = Awaited<ReturnType<typeof getServerUsersPage>>["rows"][number];

export type UsersListItem = Omit<ServerUserRow, "featuredBadges" | "joinedAt"> & {
  title: string | null;
};
