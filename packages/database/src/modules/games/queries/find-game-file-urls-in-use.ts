import { and, arrayOverlaps, eq, inArray, or } from "drizzle-orm";

import { db } from "#db/client";
import { games } from "#db/schema";

export async function findGameFileUrlsInUse({
  serverId,
  urls,
}: {
  serverId: string;
  urls: string[];
}) {
  const stillUsed = await db
    .select({ thumbnailUrl: games.thumbnailUrl, images: games.images })
    .from(games)
    .where(
      and(
        eq(games.serverId, serverId),
        or(inArray(games.thumbnailUrl, urls), arrayOverlaps(games.images, urls)),
      ),
    );
  return new Set(stillUsed.flatMap((game) => [game.thumbnailUrl, ...game.images]));
}
