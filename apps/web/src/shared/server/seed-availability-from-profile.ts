import "server-only";
import type { Game } from "@roll-and-call/database";
import {
  getUserConfirmedSlots,
  hasAnsweredAvailability,
  seedAvailabilities,
} from "@roll-and-call/database/games";
import { isAwaitingResult, SCHEDULE_MODE } from "@roll-and-call/database/games/model";

import { availabilityPrefill, buildDayColumns, buildTimeRows } from "@/shared/lib";

import { getProfile } from "./db/get-profile";

// 프로필의 기본 가능 시간으로 조율표를 칠한다. 칠했으면 true, 건너뛰었거나 칠할 칸이 없으면 false.
// 이 게임에 이미 칸을 낸 적이 있으면(재참여 포함) 본인이 낸 답을 덮지 않는다. 추첨·선발 전 신청자는 칠하지 않는다.
export async function seedAvailabilityFromProfile({
  game,
  userId,
}: {
  game: Game;
  userId: string;
}): Promise<boolean> {
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) return false;
  if (game.confirmedAt || !game.rangeStart || !game.rangeEnd) return false;
  if (isAwaitingResult(game)) return false;

  const serverId = game.serverId;
  if (await hasAnsweredAvailability({ serverId, gameId: game.id, userId })) return false;

  const profile = await getProfile(serverId, userId);
  const prefillKeys = availabilityPrefill({
    intervals: profile?.availability ?? [],
    days: buildDayColumns({ rangeStart: game.rangeStart, rangeEnd: game.rangeEnd }),
    timeRows: buildTimeRows({ startHour: game.windowStartHour, endHour: game.windowEndHour }),
  });

  // 다른 확정 세션이 차지한 칸은 조율표에서도 못 칠하는 칸이라 여기서도 뺀다.
  const blocked = new Set(
    await getUserConfirmedSlots({ serverId, userId, excludeGameId: game.id }),
  );
  const slotStarts = prefillKeys
    .filter((slotIso) => !blocked.has(slotIso))
    .map((slotIso) => new Date(slotIso));
  if (slotStarts.length === 0) return false;
  await seedAvailabilities({ serverId, gameId: game.id, userId, slotStarts });
  return true;
}
