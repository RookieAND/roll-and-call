import "server-only";
import type { RulebookKind } from "@roll-and-call/database";

import { kindImpactLosers } from "./kind-impact-losers";
import { loadSnapshot } from "./snapshot";

const PAGE_SIZE = 20;

// 종류 변경 확인 창의 목록을 쪽으로 읽는다. total은 검색과 무관한 전체 인원(제목 옆 뱃지)이다.
export async function getKindImpact({
  rulebookId,
  nextKind,
  query,
  cursor,
}: {
  rulebookId: string;
  nextKind: RulebookKind;
  query?: string;
  cursor?: string | null;
}) {
  const db = await loadSnapshot();
  const losers = kindImpactLosers({ records: db, rulebookId, nextKind });
  const keyword = query?.trim().toLowerCase();
  const matched = keyword
    ? losers.filter((loser) => loser.nickname.toLowerCase().includes(keyword))
    : losers;
  const offset = Number(cursor ?? 0) || 0;
  const end = offset + PAGE_SIZE;
  return {
    total: losers.length,
    rows: matched.slice(offset, end),
    nextCursor: end < matched.length ? String(end) : null,
  };
}

export type KindImpactPage = Awaited<ReturnType<typeof getKindImpact>>;
