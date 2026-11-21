import type { BadgeLook } from "@roll-and-call/database/badges/model";
import type { getServerUsersPage } from "@roll-and-call/database/profiles";

type ServerUserRow = Awaited<ReturnType<typeof getServerUsersPage>>["rows"][number];

export type UsersListItem = Omit<ServerUserRow, "featuredBadges" | "joinedAt"> & {
  title: { emoji: string; name: string; look: BadgeLook; tag: string | null } | null;
};
