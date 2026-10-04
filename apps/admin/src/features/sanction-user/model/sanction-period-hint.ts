import { isNull } from "es-toolkit";

import { formatDate, formatDateTime } from "@/shared/lib";

export const SANCTION_EFFECT_TEXT = "제재 중에는 참가 신청·구인 개설·룰북 인증 신청이 막힙니다.";

// 제재 기간 묶음 설명의 첫 줄. 둘째 줄은 SANCTION_EFFECT_TEXT.
export function sanctionPeriodHint({
  validDays,
  end,
  now,
}: {
  validDays: boolean;
  end: Date | null;
  now: Date;
}) {
  if (!validDays) return "1일 이상의 일수를 입력해 주세요.";
  if (isNull(end)) return "해제하기 전까지 적용됩니다.";
  return `오늘(${formatDate(now)}) 확정하면 ${formatDateTime(end)}까지 적용됩니다.`;
}
