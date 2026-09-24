import "server-only";
import { loadSnapshot } from "./snapshot";
import { toNoShowRow, type NoShowTiming } from "./to-no-show-row";

export const NO_SHOW_TIMINGS = { before: "세션 전", after: "세션 후" } as const;
export const NO_SHOW_STATUSES = { valid: "유효", cancelled: "취소됨" } as const;
export type NoShowStatus = keyof typeof NO_SHOW_STATUSES;

export interface NoShowFilter {
  query?: string;
  timing?: NoShowTiming;
  status?: NoShowStatus;
}

// 최신 세션 순. 검색어는 닉네임과 세션 제목에 모두 맞춰 본다.
export async function listNoShows({ query, timing, status }: NoShowFilter) {
  const db = await loadSnapshot();
  return db.noShows
    .map((noShow) => toNoShowRow(db, noShow))
    .filter(
      (row) =>
        (!query || row.nickname.includes(query) || row.sessionTitle.includes(query)) &&
        (!timing || row.timing === timing) &&
        (!status || row.cancelled === (status === "cancelled")),
    )
    .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
}
