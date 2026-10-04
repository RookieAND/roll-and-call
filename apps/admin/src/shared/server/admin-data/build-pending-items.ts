import { minBy } from "es-toolkit";

import { waitedDays } from "./waited-days";

export const PENDING_KINDS = ["cert", "rulebookRequest"] as const;
export type PendingKind = (typeof PENDING_KINDS)[number];

export interface PendingItem {
  kind: PendingKind;
  count: number;
  oldestDays: number;
  // 홈 [처리하기]·⌘K·휴대폰이 바로 여는 가장 오래 기다린 인증 신청(D193). 추가 요청은 목록 탭으로 가서 null이다.
  oldestId: string | null;
}

interface PendingSources {
  certs: { id: string; at: Date; reviewable: boolean }[];
  rulebookRequests: { at: Date }[];
  now?: number;
}

// 서플리먼트 대기처럼 지금 심사할 수 없는 신청은 가장 오래된 건 후보에서 뺀다(심사 대기열과 같은 규칙).
// 0건인 종류는 빼고, 오래 기다린 종류가 위다.
export function buildPendingItems({ certs, rulebookRequests, now }: PendingSources): PendingItem[] {
  const reviewable = certs.filter((cert) => cert.reviewable);
  const oldestCert = minBy(reviewable.length ? reviewable : certs, (cert) => cert.at.getTime());
  const oldestRequest = minBy(rulebookRequests, (request) => request.at.getTime());
  const items: PendingItem[] = [
    {
      kind: "cert",
      count: certs.length,
      oldestDays: oldestCert ? waitedDays(oldestCert.at, now) : 0,
      oldestId: oldestCert?.id ?? null,
    },
    {
      kind: "rulebookRequest",
      count: rulebookRequests.length,
      oldestDays: oldestRequest ? waitedDays(oldestRequest.at, now) : 0,
      oldestId: null,
    },
  ];
  return items
    .filter((item) => item.count > 0)
    .toSorted((first, second) => second.oldestDays - first.oldestDays);
}
