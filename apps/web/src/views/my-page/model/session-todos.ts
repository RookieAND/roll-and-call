import {
  SESSION_ACTION_KIND,
  type MySessions,
  type SessionCardModel,
} from "@/widgets/session-list";

export type TodoItem = { card: SessionCardModel; eyebrow: string };

// 세션이 열리는 것을 막는 건 이 셋뿐이라 어딘가에는 남아야 한다.
// 우선순위: ① 기한 지난 미확정(GM) ② 신청 승인 대기(GM) ③ 가능 시간 미제출.
export function sessionTodos({ host, player }: MySessions): TodoItem[] {
  const overdue = host
    .filter((card) => card.todo?.kind === SESSION_ACTION_KIND.confirmTime)
    .map((card) => ({ card, eyebrow: "기한이 지났습니다" }));

  // 모집이 끝났거나 세션 시간이 정해졌으면(사전 지정·조율 확정 모두) 신청 검토가 세션을 막고 있지 않다.
  const unreviewed = host
    .filter(
      (card) =>
        card.waitingCount > 0 &&
        card.todo === null &&
        !card.deadlinePassed &&
        card.startsAt === null,
    )
    .map((card) => ({
      card: {
        ...card,
        schedule: "들어온 신청을 아직 확인하지 않았습니다",
        action: {
          kind: SESSION_ACTION_KIND.reviewApplicants,
          label: `신청 ${card.waitingCount}건 보기`,
          href: `/games/${card.id}/participants`,
        },
      },
      eyebrow: "신청 승인 대기",
    }));

  const unsubmitted = player
    .filter((card) => card.todo?.kind === SESSION_ACTION_KIND.submitAvailability)
    .map((card) => ({ card, eyebrow: "가능 시간 미제출" }));

  return [...overdue, ...unreviewed, ...unsubmitted];
}
