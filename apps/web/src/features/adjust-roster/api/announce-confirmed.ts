import "server-only";
import { hasAnsweredAvailability } from "@roll-and-call/database/games";

import {
  notifyDirectConfirmed,
  seedAvailabilityFromProfile,
  type Game,
  type Server,
} from "@/shared/server";

// 커밋 뒤에 기본 가능 시간을 칠하고, 그래도 낸 칸이 없는 사람은 스레드 안내 끝에 함께 적는다.
export async function announceConfirmed({
  server,
  game,
  userIds,
}: {
  server: Server;
  game: Game;
  userIds: readonly string[];
}) {
  const needsAvailabilityUserIds: string[] = [];
  for (const userId of userIds) {
    if (await seedAvailabilityFromProfile({ game, userId })) continue;
    const answered = await hasAnsweredAvailability({
      serverId: server.id,
      gameId: game.id,
      userId,
    });
    if (!answered) needsAvailabilityUserIds.push(userId);
  }
  await notifyDirectConfirmed({ server, gameId: game.id, userIds, needsAvailabilityUserIds });
}
