import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

import type { DrawEntry } from "./draw-entry";

type DrawParticipant = {
  userId: string;
  joinedAt: Date;
  status: ParticipantStatus;
  drawRoll: number | null;
  user: { username: string; avatarUrl: string | null; bio: string | null } | null;
};

// 적용 전후 모두 굴린 값으로 두 통을 가른다. 적용 뒤 명단이 바뀌어도 이 페이지는 추첨 당시 기록으로 남는다.
// ponytail: 나간 사람은 행이 지워져 기록에서도 빠진다. 기록을 박제해야 하면 적용 시점 스냅샷을 저장한다.
export function toDrawOutcome(participants: DrawParticipant[], maxPlayers: number) {
  const toEntry = (participant: DrawParticipant): DrawEntry => ({
    userId: participant.userId,
    username: participant.user?.username ?? "익명",
    avatarUrl: participant.user?.avatarUrl ?? null,
    bio: participant.user?.bio ?? null,
    roll: participant.drawRoll,
  });
  const rolled = participants
    .filter((participant) => participant.drawRoll !== null)
    .toSorted(
      (left, right) =>
        left.drawRoll! - right.drawRoll! || left.joinedAt.getTime() - right.joinedAt.getTime(),
    )
    .map(toEntry);
  const preConfirmed = participants
    .filter(
      (participant) =>
        participant.drawRoll === null && participant.status === PARTICIPANT_STATUS.confirmed,
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
