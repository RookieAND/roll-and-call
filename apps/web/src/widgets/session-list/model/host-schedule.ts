import { formatDateClock } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";

export function hostSchedule({
  facts,
  endDate,
  readOnly,
}: {
  facts: SessionFacts;
  endDate: Date | string;
  readOnly?: boolean;
}) {
  const { lotteryOpen, awaitingTime, sessionWhen, sessionAgo, line } = facts;
  if (lotteryOpen && !line.deadlinePassed) return `${formatDateClock(endDate)} 마감 때 추첨합니다`;
  // 마감 뒤 뽑기 전의 추첨 진행 문구는 남의 화면에 두지 않는다(D93).
  if (lotteryOpen && !readOnly) return "모집이 끝나 곧 추첨합니다";
  if (awaitingTime) {
    return readOnly
      ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
      : "조율 기한이 지났습니다 · 세션 일시를 정해 주세요";
  }
  if (sessionWhen) return joinParts(sessionWhen, sessionAgo);
  return joinParts(line.text, line.deadline);
}
