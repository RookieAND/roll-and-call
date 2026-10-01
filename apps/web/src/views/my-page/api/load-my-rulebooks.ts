import { cache } from "react";

import { toMyRulebooks } from "@/entities/rulebook";
import { getCurrentServer, getRulebookRecords } from "@/shared/server";

export const loadMyRulebooks = cache(async (userId: string) => {
  const server = await getCurrentServer();
  return toMyRulebooks(await getRulebookRecords({ serverId: server.id, userId }));
});
