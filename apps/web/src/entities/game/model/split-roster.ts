import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";

type Member = {
  userId: string;
  joinedAt: Date | string;
  status: ParticipantStatus;
  // 추첨을 돌렸으면 이 값이 순서다. 없으면 신청 순서.
  drawRank?: number | null;
};

export type RosterMember<T> = T & {
  applicationRank: number;
  waitlistRank: number | null;
};

export function splitRoster<T extends Member>(participants: T[]) {
  const byOrder = participants.toSorted(
    (left, right) =>
      (left.drawRank ?? 0) - (right.drawRank ?? 0) ||
      new Date(left.joinedAt).getTime() - new Date(right.joinedAt).getTime(),
  );

  const confirmed: RosterMember<T>[] = [];
  const waiting: RosterMember<T>[] = [];

  byOrder.forEach((participant, index) => {
    if (participant.status === PARTICIPANT_STATUS.waiting) {
      waiting.push({
        ...participant,
        applicationRank: index + 1,
        waitlistRank: waiting.length + 1,
      });
    } else {
      confirmed.push({ ...participant, applicationRank: index + 1, waitlistRank: null });
    }
  });

  return { confirmed, waiting };
}
