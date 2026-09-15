import { and, eq } from "drizzle-orm";
import "server-only";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { db, notifyGameJoined, participants, type Game } from "@/shared/server";

import { UNKNOWN_USERNAME } from "../model/unknown-username";

export async function announceNewApplication(
  game: Game,
  applicantId: string,
  isWaiting: boolean,
  confirmedCount: number,
) {
  const [applicant, gm, waitingCount] = await Promise.all([
    db.query.profiles.findFirst({
      where: (table, { eq: equals }) => equals(table.id, applicantId),
      columns: { username: true },
    }),
    db.query.profiles.findFirst({
      where: (table, { eq: equals }) => equals(table.id, game.gmId),
      columns: { username: true },
    }),
    db.$count(
      participants,
      and(eq(participants.gameId, game.id), eq(participants.status, PARTICIPANT_STATUS.waiting)),
    ),
  ]);
  await notifyGameJoined(game, {
    applicantName: applicant?.username ?? UNKNOWN_USERNAME,
    gmName: gm?.username ?? UNKNOWN_USERNAME,
    confirmedCount,
    waitingCount,
    isWaiting,
  });
}
