import { db } from "#db/client";
import { rulebookRequests } from "#db/schema";

type NewRulebookRequest = typeof rulebookRequests.$inferInsert;

export async function createRulebookRequest({
  serverId,
  request,
}: {
  serverId: string;
  request: Omit<NewRulebookRequest, "serverId">;
}) {
  await db.insert(rulebookRequests).values({ ...request, serverId });
}
