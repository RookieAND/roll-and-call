import { supplementCoresOpened } from "@roll-and-call/database/certifications/model";

import type { GrantOptions } from "@/shared/server";

export const GRANT_CANDIDATE_STATUS = {
  certified: "certified",
  blocked: "blocked",
  pending: "pending",
  none: "none",
  applied: "applied",
} as const;
export type GrantCandidateStatus =
  (typeof GRANT_CANDIDATE_STATUS)[keyof typeof GRANT_CANDIDATE_STATUS];

type GrantBook = GrantOptions["books"][number];

// 고를 수 없는 것은 이미 인증한 사람과 같은 판본 기본 룰북을 열지 않은 서플리먼트 대상이다(R15).
// applied는 반려·승인된 지난 신청만 있는 사람이다.
// alsoGrantingIds는 같은 요청에 함께 고른 룰북이다. 함께 고른 기본 룰북은 서플리먼트 조건을 채운다.
export function grantCandidateStatus({
  userId,
  book,
  options,
  alsoGrantingIds = [],
}: {
  userId: string;
  book: GrantBook;
  options: GrantOptions;
  alsoGrantingIds?: readonly string[];
}): GrantCandidateStatus {
  const mine = (pair: { userId: string; rulebookId: string }) =>
    pair.userId === userId && pair.rulebookId === book.id;
  if (options.certifications.some(mine)) return GRANT_CANDIDATE_STATUS.certified;
  const certifiedIds = new Set([
    ...options.certifications
      .filter((pair) => pair.userId === userId)
      .map((pair) => pair.rulebookId),
    ...alsoGrantingIds,
  ]);
  if (!supplementCoresOpened({ book, books: options.books, certifiedIds })) {
    return GRANT_CANDIDATE_STATUS.blocked;
  }
  if (options.pending.some(mine)) return GRANT_CANDIDATE_STATUS.pending;
  if (options.applied.some(mine)) return GRANT_CANDIDATE_STATUS.applied;
  return GRANT_CANDIDATE_STATUS.none;
}

const LOCKED_STATUSES: readonly GrantCandidateStatus[] = [
  GRANT_CANDIDATE_STATUS.certified,
  GRANT_CANDIDATE_STATUS.blocked,
];

export interface GrantMemberBookStatus {
  book: GrantBook;
  status: GrantCandidateStatus;
}

export interface GrantMemberPlan {
  statuses: GrantMemberBookStatus[];
  // 이 유저에게 실제로 부여할 룰북. 이미 인증했거나 기본 룰북이 막힌 책은 뺀다.
  grantable: GrantBook[];
  // 부여할 룰북 중 대기 중인 심사 신청이 있어 승인으로 처리되는 것.
  approving: GrantBook[];
  alreadyCertified: GrantBook[];
  blocked: GrantBook[];
}

// 고른 룰북마다 이 유저의 상태를 계산해 실제로 부여할 책을 가른다. 책 하나만 고르면 그 책의 상태 그대로다.
export function grantMemberPlan({
  userId,
  books,
  options,
}: {
  userId: string;
  books: readonly GrantBook[];
  options: GrantOptions;
}): GrantMemberPlan {
  const bookIds = books.map((book) => book.id);
  const statuses = books.map((book) => ({
    book,
    status: grantCandidateStatus({
      userId,
      book,
      options,
      alsoGrantingIds: bookIds.filter((id) => id !== book.id),
    }),
  }));
  const booksOf = (accept: (status: GrantCandidateStatus) => boolean) =>
    statuses.filter((row) => accept(row.status)).map((row) => row.book);
  return {
    statuses,
    grantable: booksOf((status) => !LOCKED_STATUSES.includes(status)),
    approving: booksOf((status) => status === GRANT_CANDIDATE_STATUS.pending),
    alreadyCertified: booksOf((status) => status === GRANT_CANDIDATE_STATUS.certified),
    blocked: booksOf((status) => status === GRANT_CANDIDATE_STATUS.blocked),
  };
}
