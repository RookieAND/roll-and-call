"use server";

import {
  getGameWithRoster,
  getUserConfirmedSlots,
  replaceAvailability,
} from "@roll-and-call/database/games";
import { revalidatePath } from "next/cache";

import { hasUserJoined, isGameGm, SCHEDULE_MODE } from "@/entities/game";
import { AUTH_REQUIRED_MESSAGE, GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

const MAX_SLOT_COUNT = 2000;

export async function saveAvailability({
  gameId,
  slotIsos,
}: {
  gameId: string;
  slotIsos: string[];
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  const game = await getGameWithRoster({ serverId: server.id, gameId });
  if (!game) return GAME_NOT_FOUND_RESULT;
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) {
    return { error: "일시가 지정된 게임은 조율 대상이 아닙니다." };
  }
  if (game.confirmedAt) return { error: "이미 일정이 확정된 게임입니다." };

  const involved =
    isGameGm({ gmId: game.gmId, userId: user.id }) ||
    hasUserJoined({ participants: game.participants, userId: user.id });
  if (!involved) {
    return { error: "참여자만 가능 시간을 등록할 수 있습니다." };
  }

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

  await replaceAvailability({ serverId: server.id, gameId, userId: user.id, slotStarts });

  revalidatePath(`/games/${gameId}/schedule`);
  return {};
}
