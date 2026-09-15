import { ddayKst } from "@/shared/lib";
import {
  type MySessions,
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  type SessionCardModel,
} from "@/widgets/session-list";

const IMMINENT_DAYS = 1;

export type TodoItem = { card: SessionCardModel; eyebrow: string };

// 우선순위: ① 기한 지난 미확정(GM) ② 가능 시간 미제출 ③ 곧 시작하는 확정 세션.
export function sessionTodos({ joined, hosted }: MySessions, now: Date = new Date()): TodoItem[] {
  const overdue = hosted
    .filter((card) => card.action?.kind === SESSION_ACTION_KIND.confirmTime)
    .map((card) => ({ card, eyebrow: "기한이 지났습니다" }));
  const unsubmitted = joined
    .filter((card) => card.action?.kind === SESSION_ACTION_KIND.submitAvailability)
    .map((card) => ({ card, eyebrow: "가능 시간 미제출" }));

  // 대기자는 이번 회차에 들어가지 않으므로 뺀다.
  const imminent = [...hosted, ...joined]
    .filter(
      (card) =>
        card.startsAt &&
        card.chip !== SESSION_CHIP.waiting &&
        new Date(card.startsAt) > now &&
        ddayKst(card.startsAt, now) <= IMMINENT_DAYS,
    )
    .toSorted((left, right) => left.sortKey - right.sortKey)
    .map((card) => ({ card, eyebrow: "곧 시작합니다" }));

  return [...overdue, ...unsubmitted, ...imminent];
}
