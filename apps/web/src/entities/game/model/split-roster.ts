import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";

type Member = {
  userId: string;
  joinedAt: Date | string;
  status: ParticipantStatus;
};

export type RosterMember<T> = T & {
  applicationRank: number;
  waitlistRank: number | null;
};

export function splitRoster<T extends Member>(participants: T[]) {
  const byJoin = participants.toSorted(
    (left, right) => new Date(left.joinedAt).getTime() - new Date(right.joinedAt).getTime(),
  );

  const confirmed: RosterMember<T>[] = [];
  const waiting: RosterMember<T>[] = [];

  byJoin.forEach((participant, index) => {
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
