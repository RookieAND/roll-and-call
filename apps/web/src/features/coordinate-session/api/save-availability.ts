"use server";

import {
  getGameWithRoster,
  getUserConfirmedSlots,
  markAvailabilitySubmitted,
  replaceAvailability,
} from "@roll-and-call/database/games";
import { withTransaction } from "@roll-and-call/database/transaction";
import { revalidatePath } from "next/cache";

import { GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { availabilityBlockReason } from "../model/availability-block-reason";

const MAX_SLOT_COUNT = 2000;

export async function saveAvailability({
  gameId,
  slotIsos,
}: {
  gameId: string;
  slotIsos: string[];
}): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const game = await getGameWithRoster({ serverId: server.id, gameId });
  if (!game) return GAME_NOT_FOUND_RESULT;
  const block = availabilityBlockReason({
    game,
    participants: game.participants,
    userId: user.id,
  });
  if (block) return { error: block };

  // 다른 확정 세션과 겹친 칸은 화면에서 막혀 있지만, 주소를 우회해 들어와도 저장하지 않는다.
  const blocked = new Set(
    await getUserConfirmedSlots({ serverId: server.id, userId: user.id, excludeGameId: gameId }),
  );

  // Trust boundary: drop anything that isn't a valid instant, and cap the count.
  const slotStarts = slotIsos
    .filter((iso) => !Number.isNaN(new Date(iso).getTime()))
    .filter((iso) => !blocked.has(new Date(iso).toISOString()))
    .slice(0, MAX_SLOT_COUNT)
    .map((iso) => new Date(iso));

  // 본인 저장은 0칸이어도 제출이다(R15). 칸 교체와 제출 표시를 함께 남긴다.
  const owner = { serverId: server.id, gameId, userId: user.id };
  await withTransaction(async (transaction) => {
    await replaceAvailability({ transaction, ...owner, slotStarts });
    await markAvailabilitySubmitted({ transaction, ...owner });
  });

  revalidatePath(serverPath({ slug: server.slug, path: `/games/${gameId}/schedule` }));
  return {};
}
