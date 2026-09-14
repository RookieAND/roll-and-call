import { ddayKst } from "@/shared/lib";
import type { MySessions, SessionCardModel } from "@/widgets/session-list";

// 이 날 수 안에 시작하는 확정 세션은 할 일로 올린다(오늘·내일).
const IMMINENT_DAYS = 1;
const UPCOMING_LIMIT = 3;

export type AgendaItem = { card: SessionCardModel; eyebrow: string };

// 홈은 지금 해야 할 일만 우선순위로 쌓는다:
// ① 기한 지난 미확정(GM) ② 가능 시간 미제출 ③ 곧 시작하는 확정 세션. 나머지 확정 세션은 "다가오는 세션".
export function homeAgenda({ joined, hosted }: MySessions, now: Date = new Date()) {
  const overdue = hosted
    .filter((c) => c.action?.kind === "confirm-time")
    .map((card) => ({ card, eyebrow: "기한이 지났습니다" }));
  const unsubmitted = joined
    .filter((c) => c.action?.kind === "submit-availability")
    .map((card) => ({ card, eyebrow: "가능 시간 미제출" }));

  // 대기자는 이번 회차에 들어가지 않으므로 다가오는 세션에서 뺀다.
  const scheduled = [...hosted, ...joined]
    .filter((c) => c.startsAt && c.chip !== "waiting" && new Date(c.startsAt) > now)
    .toSorted((a, b) => a.sortKey - b.sortKey);
  const imminent = scheduled.filter((c) => ddayKst(c.startsAt!, now) <= IMMINENT_DAYS);
  const upcoming = scheduled.filter((c) => !imminent.includes(c)).slice(0, UPCOMING_LIMIT);

  const todos: AgendaItem[] = [
    ...overdue,
    ...unsubmitted,
    ...imminent.map((card) => ({ card, eyebrow: "곧 시작합니다" })),
  ];
  return { todos, upcoming };
}
