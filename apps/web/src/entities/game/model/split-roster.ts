import { compareWaitlistOrder } from "@roll-and-call/database/games/model";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";

type Member = {
  userId: string;
  joinedAt: Date | string;
  status: ParticipantStatus;
  // 추첨을 돌렸으면 이 값이 순서다. 없으면 신청 순서.
  drawRank?: number | null;
  waitlistedAt?: Date | string | null;
};

export type RosterMember<T> = T & {
  applicationRank: number;
  waitlistRank: number | null;
};

// 확정·불참은 신청 순서, 대기는 대기로 들어온 순서(compareWaitlistOrder)로 순번을 매긴다.
export function splitRoster<T extends Member>(participants: T[]) {
  const byApplication = participants.toSorted(
    (left, right) =>
      (left.drawRank ?? 0) - (right.drawRank ?? 0) ||
      new Date(left.joinedAt).getTime() - new Date(right.joinedAt).getTime(),
  );
  const applicationRanks = new Map(
    byApplication.map((participant, index) => [participant, index + 1]),
  );
  const withRank = (participant: T, waitlistRank: number | null): RosterMember<T> => ({
    ...participant,
    applicationRank: applicationRanks.get(participant)!,
    waitlistRank,
  });
  const ofStatus = (status: ParticipantStatus) =>
    byApplication.filter((participant) => participant.status === status);

  return {
    confirmed: ofStatus(PARTICIPANT_STATUS.confirmed).map((participant) =>
      withRank(participant, null),
    ),
    waiting: ofStatus(PARTICIPANT_STATUS.waiting)
      .toSorted(compareWaitlistOrder)
      .map((participant, index) => withRank(participant, index + 1)),
    removed: ofStatus(PARTICIPANT_STATUS.removed).map((participant) => withRank(participant, null)),
  };
}
