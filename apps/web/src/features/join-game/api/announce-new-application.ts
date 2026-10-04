import "server-only";
import { countParticipants } from "@roll-and-call/database/games";
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
  const [applicantName, gmName, waitingCount] = await Promise.all([
    getMemberNickname({ serverId: game.serverId, userId: applicantId }),
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
    applicantName: applicantName ?? UNKNOWN_USERNAME,
    gmName: gmName ?? UNKNOWN_USERNAME,
    confirmedCount,
    waitingCount,
    isWaiting,
  });
}
