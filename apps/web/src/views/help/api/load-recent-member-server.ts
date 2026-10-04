import "server-only";
import { listMemberServers } from "@roll-and-call/database/servers";

import { getCurrentSessionUser } from "@/shared/server";

export async function loadRecentMemberServer() {
  const user = await getCurrentSessionUser();
  if (!user) return undefined;
  const [server] = await listMemberServers(user.id);
  return server;
}
