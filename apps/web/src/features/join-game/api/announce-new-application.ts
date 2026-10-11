import "server-only";
import { countParticipants } from "@roll-and-call/database/games";
import { RECRUIT_METHOD } from "@roll-and-call/database/games/model";
import { getMemberNickname } from "@roll-and-call/database/profiles";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { notifyGameJoined, type Game, type Server } from "@/shared/server";

import { UNKNOWN_USERNAME } from "../model/unknown-username";

export async function announceNewApplication({
  server,
  game,
  applicantId,
  isWaiting,
  confirmedCount,
}: {
  server: Server;
  game: Game;
  applicantId: string;
  isWaiting: boolean;
  confirmedCount: number;
}) {
  // 추첨·선발 모집은 신청이 곧 확정이 아니고 결과를 따로 알리므로, 신청마다 스레드를 울리지 않는다.
  if (game.recruitMethod !== RECRUIT_METHOD.firstCome) return;
  const [gmName, waitingCount] = await Promise.all([
    getMemberNickname({ serverId: game.serverId, userId: game.gmId }),
    countParticipants({
      serverId: game.serverId,
      gameId: game.id,
      status: PARTICIPANT_STATUS.waiting,
    }),
  ]);
  await notifyGameJoined({
    server,
    game,
    applicantId,
    gmName: gmName ?? UNKNOWN_USERNAME,
    confirmedCount,
    waitingCount,
    isWaiting,
  });
}
