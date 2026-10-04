import "server-only";
import { deriveGameStatus, gameStatusLabel } from "@roll-and-call/database/games/model";
import { loadMemberOngoing } from "@roll-and-call/database/moderation";

import { getCurrentServer } from "../auth/get-current-server";

// 제재 페이지 「진행 중인 활동」. 범위는 추방 영향과 같은 loadMemberOngoing이다.
export async function getMemberOngoing(userId: string) {
  const server = await getCurrentServer();
  const ongoing = await loadMemberOngoing({ serverId: server.id, userId });
  return ongoing.map(({ game, gmNickname, role, confirmedCount, notifiedCount }) => ({
    sessionId: game.id,
    title: game.title,
    role,
    startsAt: game.confirmedAt,
    statusLabel: gameStatusLabel[deriveGameStatus({ ...game, participantCount: confirmedCount })],
    confirmedCount,
    capacity: game.maxPlayers,
    gmNickname,
    notifiedCount,
  }));
}

export type MemberOngoingRow = Awaited<ReturnType<typeof getMemberOngoing>>[number];
