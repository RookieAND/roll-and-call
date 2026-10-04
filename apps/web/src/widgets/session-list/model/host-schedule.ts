import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";

export function hostSchedule({ facts, readOnly }: { facts: SessionFacts; readOnly?: boolean }) {
  const { drawPending, awaitingTime, sessionWhen, sessionAgo, line } = facts;
  if (drawPending) {
    return "모집이 끝나 곧 추첨합니다";
  }
  if (awaitingTime) {
    return readOnly
      ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
      : "조율 기한이 지났습니다 · 세션 일시를 정해주세요";
  }
  if (sessionWhen) return joinParts(sessionWhen, sessionAgo);
  return joinParts(line.text, line.deadline);
}
