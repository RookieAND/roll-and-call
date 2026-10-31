import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { games, participants, profiles, rulebookCategories, rulebooks, servers } from "#db/schema";

// Canvas 포인트 이벤트(game.started)에 실을 사실만 모은다. 룰북이 없거나 룰 분류가 없으면 미니룰로 센다(miniRuleOf와 같은 규칙).
export async function getGameForCanvasStart(gameId: string) {
  const [game] = await db
    .select({
      title: games.title,
      serverSlug: servers.slug,
      gmDiscordId: profiles.discordId,
      miniRule: rulebookCategories.miniRule,
    })
    .from(games)
    .innerJoin(servers, eq(servers.id, games.serverId))
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .where(eq(games.id, gameId));
  if (!game?.gmDiscordId) return undefined;
  const players = await db
    .select({ discordId: profiles.discordId })
    .from(participants)
    .innerJoin(profiles, eq(profiles.id, participants.userId))
    .where(
      and(
        eq(participants.gameId, gameId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
        isNotNull(profiles.discordId),
      ),
    );
  return {
    gameTitle: game.title,
    serverSlug: game.serverSlug,
    gmDiscordId: game.gmDiscordId,
    participantDiscordIds: players.flatMap((player) => player.discordId ?? []),
    miniRule: game.miniRule ?? true,
  };
}
