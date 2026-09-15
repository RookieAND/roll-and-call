import { ddayKst } from "@/shared/lib";
import {
  type MySessions,
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  type SessionCardModel,
} from "@/widgets/session-list";

const IMMINENT_DAYS = 1;
const UPCOMING_LIMIT = 3;

export type AgendaItem = { card: SessionCardModel; eyebrow: string };

// 우선순위: ① 기한 지난 미확정(GM) ② 가능 시간 미제출 ③ 곧 시작하는 확정 세션. 나머지 확정 세션은 "다가오는 세션".
export function homeAgenda({ joined, hosted }: MySessions, now: Date = new Date()) {
  const overdue = hosted
    .filter((card) => card.action?.kind === SESSION_ACTION_KIND.confirmTime)
    .map((card) => ({ card, eyebrow: "기한이 지났습니다" }));
  const unsubmitted = joined
    .filter((card) => card.action?.kind === SESSION_ACTION_KIND.submitAvailability)
    .map((card) => ({ card, eyebrow: "가능 시간 미제출" }));

  // 대기자는 이번 회차에 들어가지 않으므로 다가오는 세션에서 뺀다.
  const scheduled = [...hosted, ...joined]
    .filter(
      (card) =>
        card.startsAt && card.chip !== SESSION_CHIP.waiting && new Date(card.startsAt) > now,
    )
    .toSorted((left, right) => left.sortKey - right.sortKey);
  const imminent = scheduled.filter((card) => ddayKst(card.startsAt!, now) <= IMMINENT_DAYS);
  const upcoming = scheduled.filter((card) => !imminent.includes(card)).slice(0, UPCOMING_LIMIT);

  const todos: AgendaItem[] = [
    ...overdue,
    ...unsubmitted,
    ...imminent.map((card) => ({ card, eyebrow: "곧 시작합니다" })),
  ];
  return { todos, upcoming };
}
