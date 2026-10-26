import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import { games } from "#db/schema";

// 열람자를 따지지 않는 가벼운 확인(기본키 조회 한 번). 비공개 구인이 쓰지 않는 조회 경로의 문지기다.
export async function isPublicGame({ serverId, gameId }: { serverId: string; gameId: string }) {
  const [found] = await db
    .select({ id: games.id })
    .from(games)
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.id, gameId),
        eq(games.visibility, GAME_VISIBILITY.public),
      ),
    );
  return Boolean(found);
}
