import "server-only";
import { loadRevokeCancelTargets } from "@roll-and-call/database/certifications";
import { deriveGameStatus, gameStatusLabel } from "@roll-and-call/database/games/model";

import { getCurrentServer } from "../auth/get-current-server";
import { loadSnapshot } from "./snapshot";

// 반려로 돌리기 창(?action=revoke&user=&rulebook=)이 보여 줄 대상과 취소되는 구인. 인증이 없으면 창을 열지 않는다.
export async function getRevokeTarget({
  userId,
  rulebookId,
}: {
  userId: string;
  rulebookId: string;
}) {
  const [server, db] = await Promise.all([getCurrentServer(), loadSnapshot()]);
  const certification = db.certifications.find(
    (item) => item.userId === userId && item.rulebookId === rulebookId,
  );
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!certification || !user) return null;
  const targets = await loadRevokeCancelTargets({ serverId: server.id, userId, rulebookId });
  return {
    userId,
    nickname: user.nickname,
    rulebookId,
    rulebook: certification.rulebook,
    games: targets.map(({ game, confirmedCount }) => ({
      sessionId: game.id,
      title: game.title,
      statusLabel: gameStatusLabel[deriveGameStatus({ ...game, participantCount: confirmedCount })],
      startsAt: game.confirmedAt,
      confirmedCount,
      capacity: game.maxPlayers,
    })),
  };
}

export type RevokeTarget = NonNullable<Awaited<ReturnType<typeof getRevokeTarget>>>;
