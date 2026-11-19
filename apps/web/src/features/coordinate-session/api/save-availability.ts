"use server";

import {
  getGameWithRoster,
  getRoundCoordination,
  getUserConfirmedSlots,
  markAvailabilitySubmitted,
  replaceAvailability,
} from "@roll-and-call/database/games";
import { awaitingResultMethod, AWAITING_RESULT_PHRASE } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { GAME_NOT_FOUND_RESULT, idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { availabilityBlockReason } from "../model/availability-block-reason";
import { isSlotInRoundCoordination } from "../model/is-slot-in-round-coordination";
import { roundAvailabilityBlockReason } from "../model/round-availability-block-reason";

const MAX_SLOT_COUNT = 2000;

const inputSchema = z.object({
  gameId: idSchema,
  slotIsos: z.array(z.iso.datetime({ offset: true })).max(MAX_SLOT_COUNT),
  roundNo: z.number().int().min(1).max(52).optional(),
});

export async function saveAvailability(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, slotIsos } = parsed.data;
  const roundNo = parsed.data.roundNo ?? 1;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const game = await getGameWithRoster({ serverId: server.id, gameId });
  if (!game) return GAME_NOT_FOUND_RESULT;
  // 다회차는 회차마다 기간이 있어 조율 중인 회차와 기간으로 막고, 단발은 기존 규칙을 쓴다.
  const isMultiRound = game.roundCount > 1;
  const coordination = isMultiRound
    ? await getRoundCoordination({ serverId: server.id, gameId, roundNo })
    : null;
  let block: string | null;
  if (isMultiRound) {
    const awaiting = awaitingResultMethod(game);
    const isMember =
      game.gmId === user.id ||
      game.participants.some(
        (participant) => participant.userId === user.id && participant.status === "confirmed",
      );
    block = awaiting
      ? `${AWAITING_RESULT_PHRASE[awaiting]} 가능 시간을 낼 수 있습니다.`
      : roundAvailabilityBlockReason({ coordination, now: new Date(), isMember });
  } else {
    block = availabilityBlockReason({ game, participants: game.participants, userId: user.id });
  }
  if (block) return { error: block };

  // 다른 확정 세션과 겹친 칸은 화면에서 막혀 있지만, 주소를 우회해 들어와도 저장하지 않는다.
  const blocked = new Set(
    await getUserConfirmedSlots({ serverId: server.id, userId: user.id, excludeGameId: gameId }),
  );

  // Trust boundary: drop anything that isn't a valid instant, and cap the count.
  const slotStarts = slotIsos
    .filter((iso) => !Number.isNaN(new Date(iso).getTime()))
    .filter((iso) => !blocked.has(new Date(iso).toISOString()))
    .filter(
      (iso) =>
        !coordination ||
        (!isNull(coordination.start) &&
          !isNull(coordination.end) &&
          !isNull(coordination.windowStartHour) &&
          !isNull(coordination.windowEndHour) &&
          isSlotInRoundCoordination({
            slot: new Date(iso),
            start: coordination.start,
            end: coordination.end,
            windowStartHour: coordination.windowStartHour,
            windowEndHour: coordination.windowEndHour,
          })),
    )
    .slice(0, MAX_SLOT_COUNT)
    .map((iso) => new Date(iso));

  // 본인 저장은 0칸이어도 제출이다(R15). 칸 교체와 제출 표시를 함께 남긴다.
  const owner = { serverId: server.id, gameId, userId: user.id };
  await withTransaction(async (transaction) => {
    await replaceAvailability({ transaction, ...owner, roundNo, slotStarts });
    await markAvailabilitySubmitted({ transaction, ...owner });
  });

  revalidatePath(serverPath({ slug: server.slug, path: `/games/${gameId}/schedule` }));
  return {};
}
