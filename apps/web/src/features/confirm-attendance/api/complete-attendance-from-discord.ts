import "server-only";
import {
  attendanceConfirmedMessage,
  DISCORD_ATTENDANCE_MESSAGE,
} from "../model/discord-attendance-message";
import {
  discordAttendanceReply as reply,
  type DiscordAttendanceReply,
} from "../model/discord-attendance-reply";
import { resolveDiscordAttendance } from "./resolve-discord-gm";
import { submitAttendance } from "./submit-attendance";
import { submitRoundAttendance } from "./submit-round-attendance";

// [완료]: 고른 사람만 불참으로 하고 나머지는 참석으로 확정한다. 웹과 같은 submitAttendance를 부른다.
// roundNo가 있으면 다회차 회차의 출석으로 웹과 같은 submitRoundAttendance를 부른다.
export async function completeAttendanceFromDiscord({
  absentUserIds,
  roundNo,
  ...input
}: {
  guildId: string;
  discordId: string;
  gameId: string;
  absentUserIds: string[];
  roundNo?: number;
}): Promise<DiscordAttendanceReply> {
  const resolved = await resolveDiscordAttendance(input);
  if (!resolved.ok) return resolved.reply;
  const { server, userId, game, webUrl } = resolved;

  if (game.gmId !== userId) return reply(DISCORD_ATTENDANCE_MESSAGE.gmOnly);
  if (roundNo) {
    const result = await submitRoundAttendance({
      actor: { serverId: server.id, slug: server.slug, gmId: userId },
      gameId: game.id,
      roundNo,
      absentUserIds,
    });
    if (result.error) return reply(result.error);
    return reply(attendanceConfirmedMessage(absentUserIds.length));
  }
  if (game.attendanceConfirmedAt) {
    return reply(DISCORD_ATTENDANCE_MESSAGE.alreadyConfirmed, webUrl(`/games/${game.id}/manage`));
  }
  const result = await submitAttendance({
    actor: { serverId: server.id, slug: server.slug, gmId: userId },
    gameId: game.id,
    absences: absentUserIds.map((absentUserId) => ({ userId: absentUserId, reason: null })),
  });
  if (result.error) return reply(result.error);
  return reply(attendanceConfirmedMessage(absentUserIds.length));
}
