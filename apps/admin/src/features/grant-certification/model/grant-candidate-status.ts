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

// 고를 수 없는 것은 이미 인증한 사람과 같은 판본 기본 룰북을 열지 않은 서플리먼트 대상이다(R15).
// applied는 반려·승인된 지난 신청만 있는 사람이다.
export function grantCandidateStatus({
  userId,
  book,
  options,
}: {
  userId: string;
  book: GrantOptions["books"][number];
  options: GrantOptions;
}): GrantCandidateStatus {
  const mine = (pair: { userId: string; rulebookId: string }) =>
    pair.userId === userId && pair.rulebookId === book.id;
  if (options.certifications.some(mine)) return GRANT_CANDIDATE_STATUS.certified;
  const certifiedIds = new Set(
    options.certifications.filter((pair) => pair.userId === userId).map((pair) => pair.rulebookId),
  );
  if (!supplementCoresOpened({ book, books: options.books, certifiedIds })) {
    return GRANT_CANDIDATE_STATUS.blocked;
  }
  if (options.pending.some(mine)) return GRANT_CANDIDATE_STATUS.pending;
  if (options.applied.some(mine)) return GRANT_CANDIDATE_STATUS.applied;
  return GRANT_CANDIDATE_STATUS.none;
}
