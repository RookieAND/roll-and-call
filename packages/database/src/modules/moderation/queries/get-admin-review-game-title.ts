import { and, eq, isNull } from "drizzle-orm";

import { db } from "#db/client";
import { games, sessionReviews } from "#db/schema";

import { isUuid } from "./is-uuid";

// 운영진이 제거한 후기는 없는 것으로 본다.
export async function getAdminReviewGameTitle({ serverId, id }: { serverId: string; id: string }) {
  if (!isUuid(id)) return undefined;
  const [row] = await db
    .select({ title: games.title })
    .from(sessionReviews)
    .innerJoin(games, and(eq(games.id, sessionReviews.gameId), eq(games.serverId, serverId)))
    .where(
      and(
        eq(sessionReviews.serverId, serverId),
        eq(sessionReviews.id, id),
        isNull(sessionReviews.removedAt),
      ),
    );
  return row?.title;
}
