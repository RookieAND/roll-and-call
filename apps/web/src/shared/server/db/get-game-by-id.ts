import "server-only";
import { db } from "@roll-and-call/database";
import { cache } from "react";
import { z } from "zod";

export type GameDetailData = NonNullable<Awaited<ReturnType<typeof getGameById>>>;

// uuid가 아닌 값을 넘기면 Postgres가 캐스팅 에러를 던지므로 없는 구인글로 본다.
export const getGameById = cache(async (id: string) => {
  if (!z.uuid().safeParse(id).success) return undefined;
  return db.query.games.findFirst({
    where: (game, { eq }) => eq(game.id, id),
    with: {
      gm: { columns: { username: true, avatarUrl: true, bio: true } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true, drawRank: true, absent: true },
        with: { user: { columns: { username: true, avatarUrl: true, bio: true } } },
      },
    },
  });
});
