import { isNull } from "es-toolkit";

import { formatDate } from "@/shared/lib";

// 활동 정지 안내 두 줄. 구인 상세·새 구인 안내·등록 잠김·마이페이지·내 룰북이 같은 문구를 쓴다.
export function sanctionLines({ reason, until }: { reason: string; until: Date | null }): string[] {
  const period = isNull(until) ? "해제될 때까지" : `${formatDate(until)}까지`;
  return [`사유: ${reason}`, `기간: ${period}`];
}
