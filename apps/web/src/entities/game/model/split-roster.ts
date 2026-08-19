import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";

type Member = {
  userId: string;
  joinedAt: Date | string;
  status: ParticipantStatus;
};

export type RosterMember<T> = T & {
  // 신청 순서 (전체 참여자 기준 1-based)
  applicationRank: number;
  // 대기 순번 (대기자 중 1-based). 확정이면 null.
  waitlistRank: number | null;
};

// 참여자를 신청 순(joinedAt)으로 정렬한 뒤 status로 확정/대기로 가른다.
// 순번은 확정/대기 승격의 근거로 화면에 노출된다.
export function splitRoster<T extends Member>(participants: T[]) {
  const byJoin = participants.toSorted(
    (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
  );

  const confirmed: RosterMember<T>[] = [];
  const waiting: RosterMember<T>[] = [];

  byJoin.forEach((p, i) => {
    if (p.status === PARTICIPANT_STATUS.waiting) {
      waiting.push({ ...p, applicationRank: i + 1, waitlistRank: waiting.length + 1 });
    } else {
      confirmed.push({ ...p, applicationRank: i + 1, waitlistRank: null });
    }
  });

  return { confirmed, waiting };
}
