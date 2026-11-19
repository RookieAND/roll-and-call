"use server";

import { listParticipantUserIds, skipRound as removeRound } from "@roll-and-call/database/games";
import { PARTICIPANT_STATUS, roundSkipBlock } from "@roll-and-call/database/games/model";
import { createNotifications, NOTIFICATION_KIND } from "@roll-and-call/database/notifications";
import { isNull } from "es-toolkit";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError, notifyRoundChanged } from "@/shared/server";

import { AttendanceError } from "./attendance-error";
import { guardRound } from "./guard-round";

const inputSchema = z.object({ gameId: idSchema, roundNo: z.number().int().min(1).max(52) });

const BLOCK_MESSAGE = {
  closed: "회차 시작부터 끝난 뒤 24시간까지만 생략할 수 있습니다.",
  too_few_rounds: "남은 회차가 2회라 더 줄일 수 없습니다. 여기서 마치기를 써 주세요.",
  finished_game: "이미 끝난 구인입니다.",
} as const;

// 회차를 생략한다. 출석·후기와 함께 회차가 사라지고 뒤 번호가 당겨진다. 확정 참여자에게 알린다.
export async function skipRound(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { gameId, roundNo } = parsed.data;
  const serverId = member.server.id;
  const result = await guardRound({
    actor: { serverId, slug: member.server.slug, gmId: member.user.id },
    gameId,
    roundNo,
    work: async (transaction, game, round) => {
      const now = new Date();
      const block = roundSkipBlock({ game, round, now });
      if (!isNull(block)) throw new AttendanceError(BLOCK_MESSAGE[block]);
      await removeRound({ transaction, serverId, gameId, roundNo, at: now });
      const userIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: game.gmId,
        notifications: userIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.roundSkipped,
          params: { gameId, gameTitle: game.title, roundNo },
        })),
      });
    },
  });
  if (!result.error) {
    after(() =>
      notifyRoundChanged({
        server: member.server,
        gameId,
        description: `${roundNo}회차가 생략되었습니다. 뒤 회차 번호가 하나씩 당겨졌습니다.`,
      }),
    );
  }
  return result;
}
