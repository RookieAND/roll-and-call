import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting, SCHEDULE_MODE } from "@roll-and-call/database/games/model";
import { getMemberNicknames } from "@roll-and-call/database/profiles";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import { gameNoticeEmbed } from "@roll-and-call/game-notices";
import { headcountFields } from "@roll-and-call/game-notices";
import { isNull } from "es-toolkit";

export async function notifyDirectConfirmed({
  server,
  gameId,
  userIds,
  needsAvailabilityUserIds = [],
}: {
  server: Server;
  gameId: string;
  userIds: readonly string[];
  // 기본 가능 시간을 칠하지 못한 사람. 조율형이고 세션 시각이 없을 때만 안내 줄을 붙인다.
  needsAvailabilityUserIds?: readonly string[];
}) {
  if (userIds.length === 0) return;

  const [game, invitedNames, unpaintedNames] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    getMemberNicknames({ serverId: server.id, userIds }),
    getMemberNicknames({ serverId: server.id, userIds: needsAvailabilityUserIds }),
  ]);
  if (!game?.discordThreadId || invitedNames.length === 0) return;

  const names = invitedNames.map((username) => `**${username}**`).join(", ");
  const asksAvailability =
    game.scheduleMode === SCHEDULE_MODE.coordinate &&
    isNull(game.confirmedAt) &&
    unpaintedNames.length > 0;
  const availabilityLine = asksAvailability
    ? `\n${unpaintedNames.map((username) => `**${username}**`).join(", ")}님은 구인 페이지에서 가능 시간을 칠해 주세요.`
    : "";

  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "✅",
    color: DISCORD_COLOR.confirmed,
    description: `GM이 ${names}님을 참여자로 확정했어요.${availabilityLine}`,
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
