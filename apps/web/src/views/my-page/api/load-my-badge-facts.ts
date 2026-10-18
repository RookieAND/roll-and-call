import { loadBadgeFacts } from "@roll-and-call/database/badges";
import { cache } from "react";

import { getCurrentServer } from "@/shared/server";

export const loadMyBadgeFacts = cache(async (userId: string) => {
  const server = await getCurrentServer();
  return loadBadgeFacts({ serverId: server.id, userId });
});
