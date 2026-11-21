import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { profiles, serverMembers } from "#db/schema";

import { serverUsersWhere, type ServerUsersFilter } from "./server-users-where";

export async function countServerUsers(filter: Omit<ServerUsersFilter, "now">) {
  return db.$count(
    db
      .select({ userId: serverMembers.userId })
      .from(serverMembers)
      .innerJoin(profiles, eq(profiles.id, serverMembers.userId))
      .where(serverUsersWhere({ ...filter, now: new Date() })),
  );
}
