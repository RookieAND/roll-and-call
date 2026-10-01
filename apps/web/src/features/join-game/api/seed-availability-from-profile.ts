import "server-only";
import {
  getUserConfirmedSlots,
  hasAnsweredAvailability,
  seedAvailabilities,
} from "@roll-and-call/database/web";

import { SCHEDULE_MODE } from "@/entities/game";
import { availabilityPrefill } from "@/entities/profile";
import { buildDayColumns, buildTimeRows } from "@/shared/lib";
import { getProfile, type Game } from "@/shared/server";

// 이 게임에 이미 칸을 낸 적이 있으면(재참여 포함) 본인이 낸 답을 덮지 않는다.
export async function seedAvailabilityFromProfile({
  game,
  userId,
}: {
  game: Game;
  userId: string;
}) {
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) return;
  if (game.confirmedAt || !game.rangeStart || !game.rangeEnd) return;

  const serverId = game.serverId;
  if (await hasAnsweredAvailability({ serverId, gameId: game.id, userId })) return;

  const profile = await getProfile(serverId, userId);
  const prefill = availabilityPrefill({
    intervals: profile?.availability ?? [],
    days: buildDayColumns({ rangeStart: game.rangeStart, rangeEnd: game.rangeEnd }),
    timeRows: buildTimeRows(),
  });
  if (!prefill) return;

  // 다른 확정 세션이 차지한 칸은 조율표에서도 못 칠하는 칸이라 여기서도 뺀다.
  const blocked = new Set(
    await getUserConfirmedSlots({ serverId, userId, excludeGameId: game.id }),
  );
  const slotStarts = prefill.keys
    .filter((slotIso) => !blocked.has(slotIso))
    .map((slotIso) => new Date(slotIso));
  await seedAvailabilities({ serverId, gameId: game.id, userId, slotStarts });
}
