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

// [완료]: 고른 사람만 불참으로 하고 나머지는 참석으로 확정한다. 웹과 같은 submitAttendance를 부른다.
export async function completeAttendanceFromDiscord({
  absentUserIds,
  ...input
}: {
  guildId: string;
  discordId: string;
  gameId: string;
  absentUserIds: string[];
}): Promise<DiscordAttendanceReply> {
  const resolved = await resolveDiscordAttendance(input);
  if (!resolved.ok) return resolved.reply;
  const { server, userId, game, webUrl } = resolved;

  if (game.gmId !== userId) return reply(DISCORD_ATTENDANCE_MESSAGE.gmOnly);
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
