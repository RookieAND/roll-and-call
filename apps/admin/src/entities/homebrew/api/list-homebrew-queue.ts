import "server-only";
import { listPendingHomebrewApplications } from "@roll-and-call/database/homebrew";

import { getCurrentServer, requireStaff } from "@/shared/server";

export async function listHomebrewQueue() {
  await requireStaff();
  const server = await getCurrentServer();
  return listPendingHomebrewApplications({ serverId: server.id });
}
