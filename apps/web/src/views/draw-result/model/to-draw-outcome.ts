import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

import type { DrawEntry } from "./draw-entry";

type DrawParticipant = {
  userId: string;
  joinedAt: Date;
  status: ParticipantStatus;
  drawRoll: number | null;
  user: { username: string; avatarUrl: string | null; bio: string | null } | null;
};

// 굴린 값으로 두 통을 가른다. 명단 대신 추첨 시점 기록(drawResults)을 넣는다.
export function toDrawOutcome({
  participants,
  maxPlayers,
}: {
  participants: DrawParticipant[];
  maxPlayers: number;
}) {
  const toEntry = (participant: DrawParticipant): DrawEntry => ({
    userId: participant.userId,
    username: participant.user?.username ?? "?",
    avatarUrl: participant.user?.avatarUrl ?? null,
    bio: participant.user?.bio ?? null,
    roll: participant.drawRoll,
  });
  const rolled = participants
    .filter((participant) => !isNull(participant.drawRoll))
    .toSorted(
      (left, right) =>
        left.drawRoll! - right.drawRoll! || left.joinedAt.getTime() - right.joinedAt.getTime(),
    )
    .map(toEntry);
  const preConfirmed = participants
    .filter(
      (participant) =>
        isNull(participant.drawRoll) && participant.status === PARTICIPANT_STATUS.confirmed,
    )
    .map(toEntry);
  const drawCount = Math.max(maxPlayers - preConfirmed.length, 0);

  return {
    confirmed: [...preConfirmed, ...rolled.slice(0, drawCount)],
    waiting: rolled.slice(drawCount),
    rolled,
    drawCount,
  };
}

export type DrawOutcome = ReturnType<typeof toDrawOutcome>;
