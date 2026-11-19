"use server";

import { confirmRoundAttendance as saveRoundAttendance } from "@roll-and-call/database/games";
import { isRoundOpen } from "@roll-and-call/database/games/model";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

import { ATTENDANCE_PAST_DEADLINE_MESSAGE } from "../model/attendance-messages";
import { AttendanceError } from "./attendance-error";
import { guardRound } from "./guard-round";

const ABSENT_MAX = 40;

const inputSchema = z.object({
  gameId: idSchema,
  roundNo: z.number().int().min(1).max(52),
  absentUserIds: z.array(idSchema).max(ABSENT_MAX),
});

// 다회차 회차의 출석을 확정하거나 다시 고친다. 빠진 사람만 받고 불참 기록은 남기지 않는다.
export async function confirmRoundAttendance(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { gameId, roundNo, absentUserIds } = parsed.data;
  const serverId = member.server.id;
  return guardRound({
    actor: { serverId, slug: member.server.slug, gmId: member.user.id },
    gameId,
    roundNo,
    work: async (transaction, _game, round) => {
      const now = new Date();
      if (!isRoundOpen({ round, now })) {
        throw new AttendanceError(
          round.startAt && round.startAt > now
            ? "아직 시작하지 않은 회차입니다."
            : ATTENDANCE_PAST_DEADLINE_MESSAGE,
        );
      }
      await saveRoundAttendance({ transaction, serverId, gameId, roundNo, absentUserIds, at: now });
    },
  });
}
