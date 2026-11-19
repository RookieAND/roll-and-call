import "server-only";
import { findGameRound } from "@roll-and-call/database/games";
import { isRoundOpen, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";

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
// roundNo가 있으면 다회차 회차의 출석이다(시작 안내 버튼이 회차를 싣는다).
export async function openAttendanceFromDiscord({
  roundNo,
  ...input
}: {
  guildId: string;
  discordId: string;
  gameId: string;
  roundNo?: number;
}): Promise<DiscordAttendanceOpen> {
  const resolved = await resolveDiscordAttendance(input);
  if (!resolved.ok) return { kind: "reply", reply: resolved.reply };
  const { server, userId, game, webUrl } = resolved;

  if (game.gmId !== userId) {
    return { kind: "reply", reply: reply(DISCORD_ATTENDANCE_MESSAGE.gmOnly) };
  }
  const attendancePath = roundNo
    ? `/games/${game.id}/attendance?round=${roundNo}`
    : `/games/${game.id}/attendance`;
  if (roundNo) {
    const round = await findGameRound({ serverId: server.id, gameId: game.id, roundNo });
    if (!round || !isRoundOpen({ round, now: new Date() })) {
      return {
        kind: "reply",
        reply: reply(DISCORD_ATTENDANCE_MESSAGE.roundClosed, webUrl(attendancePath)),
      };
    }
    if (round.attendanceConfirmedAt) {
      return {
        kind: "reply",
        reply: reply(DISCORD_ATTENDANCE_MESSAGE.alreadyConfirmed, webUrl(attendancePath)),
      };
    }
  } else if (game.attendanceConfirmedAt) {
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
      reply: reply(DISCORD_ATTENDANCE_MESSAGE.tooMany, webUrl(attendancePath)),
    };
  }
  return { kind: "select", options };
}
