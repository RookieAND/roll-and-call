import "server-only";
import { isAbsenceActive } from "@roll-and-call/database/games/model";

import { loadSnapshot } from "./snapshot";

const LIMIT = 20;

export interface NoShowSessionCandidate {
  id: string;
  title: string;
  gmNickname: string;
  startsAt: Date;
  autoConfirmed: boolean;
  // 확정 참여자와 불참으로 내보낸 사람. 이미 불참이거나 내보낸 사람은 고를 수 없다.
  participants: { userId: string; nickname: string; absent: boolean }[];
}

// 불참 기록 추가에서 고를 세션: 출석이 확정되고 세션 시작 30일 안인 이 서버 구인, 최신순.
// total은 검색어와 상관없는 후보 수로, 0이면 「고를 세션 없음」을 보인다.
export async function searchNoShowSessions(query: string | undefined) {
  const db = await loadSnapshot();
  const now = Date.now();
  const nicknameOf = (id: string) => db.users.find((user) => user.id === id)?.nickname ?? "";
  const candidates = db.sessions
    .filter(
      (session) =>
        session.attendanceConfirmedAt &&
        isAbsenceActive({ sessionStartsAt: session.startsAt, now }),
    )
    .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  const keyword = query?.trim().toLowerCase();
  if (!keyword) return { total: candidates.length, sessions: [] };
  const sessions: NoShowSessionCandidate[] = candidates
    .filter(
      (session) =>
        session.title.toLowerCase().includes(keyword) ||
        nicknameOf(session.gmId).toLowerCase().includes(keyword),
    )
    .slice(0, LIMIT)
    .map((session) => {
      const noShows = db.noShows.filter((noShow) => noShow.sessionId === session.id);
      const removedIds = noShows
        .map((noShow) => noShow.userId)
        .filter((userId) => !session.memberIds.includes(userId));
      return {
        id: session.id,
        title: session.title,
        gmNickname: nicknameOf(session.gmId),
        startsAt: session.startsAt,
        autoConfirmed: Boolean(session.attendanceAutoConfirmed),
        participants: [...session.memberIds, ...removedIds].map((userId) => ({
          userId,
          nickname: nicknameOf(userId),
          absent:
            removedIds.includes(userId) ||
            noShows.some((noShow) => noShow.userId === userId && !noShow.cancelled),
        })),
      };
    });
  return { total: candidates.length, sessions };
}

export type NoShowSessionSearch = Awaited<ReturnType<typeof searchNoShowSessions>>;
