import { cache } from "react";

import { getBadgeFacts, getCurrentServer } from "@/shared/server";

export const loadMyBadgeFacts = cache(async (userId: string) => {
  const server = await getCurrentServer();
  return getBadgeFacts({ serverId: server.id, userId });
});
