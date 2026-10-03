import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { games, servers } from "../../../schema";

// 서버 없는 옛 구인 주소를 그 구인의 서버로 보낼 때 쓴다. 숨기거나 취소한 구인도 찾는다.
export async function findGameServerSlug(gameId: string) {
  const [row] = await db
    .select({ slug: servers.slug })
    .from(games)
    .innerJoin(servers, eq(servers.id, games.serverId))
    .where(eq(games.id, gameId));
  return row?.slug;
}
