import "server-only";
import { PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";

import { DISCORD_ATTENDANCE_MESSAGE } from "../model/discord-attendance-message";
import {
  discordAttendanceReply as reply,
  type DiscordAttendanceReply,
} from "../model/discord-attendance-reply";
import { resolveDiscordAttendance } from "./resolve-discord-gm";

// 디스코드 셀렉트 메뉴는 선택지가 25개까지다.
const SELECT_OPTION_LIMIT = 25;

export type DiscordAttendanceOpen =
  | { kind: "reply"; reply: DiscordAttendanceReply }
  | { kind: "select"; options: { userId: string; name: string }[] };

// [출석 입력하기]를 눌렀을 때 여는 본인에게만 보이는 메시지. GM이 아니거나 이미 확정됐으면 안내만 한다.
export async function openAttendanceFromDiscord(input: {
  guildId: string;
  discordId: string;
  gameId: string;
}): Promise<DiscordAttendanceOpen> {
  const resolved = await resolveDiscordAttendance(input);
  if (!resolved.ok) return { kind: "reply", reply: resolved.reply };
  const { userId, game, webUrl } = resolved;

  if (game.gmId !== userId) {
    return { kind: "reply", reply: reply(DISCORD_ATTENDANCE_MESSAGE.gmOnly) };
  }
  if (game.attendanceConfirmedAt) {
    return {
      kind: "reply",
      reply: reply(DISCORD_ATTENDANCE_MESSAGE.alreadyConfirmed, webUrl(`/games/${game.id}/manage`)),
    };
  }
  const options = game.participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
    .map((participant) => ({ userId: participant.userId, name: participant.user.username }));
  if (options.length === 0) {
    return { kind: "reply", reply: reply(DISCORD_ATTENDANCE_MESSAGE.noAttendee) };
  }
  if (options.length > SELECT_OPTION_LIMIT) {
    return {
      kind: "reply",
      reply: reply(DISCORD_ATTENDANCE_MESSAGE.tooMany, webUrl(`/games/${game.id}/attendance`)),
    };
  }
  return { kind: "select", options };
}
