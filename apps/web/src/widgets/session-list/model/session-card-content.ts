import {
  countConfirmed,
  RECRUIT_METHOD,
  scheduleLine,
  SESSION_ROLE,
  type SessionGame,
} from "@/entities/game";
import { formatDateClock } from "@/shared/lib";

import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  type SessionCardBase,
  type SessionContext,
} from "./session-card-model";

// 일정은 항상 같은 줄에 두고, 상태 설명과 다음 행동을 분리한다.
export function sessionCardContent({
  game,
  card,
  context,
}: {
  game: SessionGame;
  card: SessionCardBase;
  context: SessionContext;
}) {
  const past = card.chip === SESSION_CHIP.ended;
  const line = scheduleLine(game, context.now);
  const host = card.role === SESSION_ROLE.host;
  const confirmed = countConfirmed(game.participants);
  const beforeResult =
    !past &&
    ((game.recruitMethod === RECRUIT_METHOD.lottery && !game.drawnAt) ||
      (game.recruitMethod === RECRUIT_METHOD.selection && !game.selectionFinishedAt));
  let notice = card.scheduleNote ?? card.caption?.text ?? null;
  let primaryAction = card.action?.kind === SESSION_ACTION_KIND.cancelWaitlist ? null : card.action;

  if (!past && card.chip === SESSION_CHIP.waiting) {
    if (beforeResult) {
      notice = line.deadlinePassed
        ? "결과를 기다리고 있습니다"
        : `${formatDateClock(game.endDate)} 신청 마감`;
    } else {
      notice = "자리가 나면 알려드립니다";
    }
  } else if (!past && card.chip === SESSION_CHIP.scheduling && !game.confirmedAt) {
    if (host && !context.readOnly) {
      notice = `가능 시간 제출 ${context.responseCounts.get(game.id) ?? 0}명`;
    } else if (!context.readOnly) {
      if (context.respondedGameIds.has(game.id)) {
        notice = "가능 시간 제출 완료";
      } else {
        notice = line.deadlinePassed
          ? "GM이 세션 시간을 정하고 있습니다"
          : `${formatDateClock(game.endDate)}까지 가능 시간을 입력해 주세요`;
      }
    }
  }

  if (!context.readOnly) {
    if (card.todo) {
      primaryAction = { kind: card.todo.kind, label: card.todo.label, href: card.todo.href };
      if (card.todo.kind === SESSION_ACTION_KIND.submitAvailability)
        primaryAction.label = "가능 시간 입력";
      if (card.todo.kind === SESSION_ACTION_KIND.confirmTime)
        notice = `가능 시간 제출 ${context.responseCounts.get(game.id) ?? 0}명 · 세션 시간을 정해 주세요`;
      if (card.todo.kind === SESSION_ACTION_KIND.fillVacancy)
        notice = `대기 ${card.waitingCount}명 · 빈자리를 채울 수 있습니다`;
    } else if (host && !past && beforeResult) {
      notice = line.deadlinePassed
        ? "모집 마감 · 참여자를 확인해 주세요"
        : `${formatDateClock(game.endDate)} 모집 마감`;
      primaryAction = {
        kind: SESSION_ACTION_KIND.fillVacancy,
        label: "참여자 관리",
        href: `/games/${game.id}/participants`,
      };
    }
  } else {
    primaryAction = null;
  }

  return {
    rule: game.rule,
    calendar: past ? card.schedule : line.text,
    notice,
    people: beforeResult
      ? game.participants.filter((p) => p.status === "confirmed" || p.status === "waiting").length
      : confirmed,
    peopleLabel: beforeResult ? "신청" : "참여자",
    primaryAction,
  };
}
