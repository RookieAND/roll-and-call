import { aggregateAvailability, type ScheduleAvailability } from "@/entities/availability";
import { getGameAvailabilities, getUserConfirmedSlots } from "@/shared/server";

// 조율 화면 첫 렌더(initialData)와 클라이언트 쿼리 라우트가 같은 모양을 쓰도록 한 곳에서 만든다.
export async function getScheduleAvailability(
  gameId: string,
  userId: string | null,
): Promise<ScheduleAvailability> {
  const [avails, blocked] = await Promise.all([
    getGameAvailabilities(gameId),
    userId ? getUserConfirmedSlots(userId, gameId) : [],
  ]);
  return { aggregate: aggregateAvailability({ avails, userId }), blocked };
}
