import {
  countConfirmed,
  deriveGameStatus,
  GAME_VISIBILITY,
  RECRUIT_METHOD,
  scheduleLine,
  SESSION_ROLE,
  type SessionGame,
  type GameCapacityProps,
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
  const waiting = game.participants.filter((p) => p.status === "waiting").length;
  const beforeResult =
    !past &&
    ((game.recruitMethod === RECRUIT_METHOD.lottery && !game.drawnAt) ||
      (game.recruitMethod === RECRUIT_METHOD.selection && !game.selectionFinishedAt));
  let notice = card.titleDanger && !card.cancelled ? (card.scheduleNote ?? null) : null;
  let primaryAction = card.action;

  if (!context.readOnly) {
    if (card.todo) {
      primaryAction = { kind: card.todo.kind, label: card.todo.label, href: card.todo.href };
      if (card.todo.kind === SESSION_ACTION_KIND.submitAvailability) {
        primaryAction.label = "가능 시간 입력";
        notice = `${formatDateClock(game.endDate)}까지 입력`;
      }
      if (card.todo.kind === SESSION_ACTION_KIND.confirmTime)
        notice = `가능 시간 ${context.responseCounts.get(game.id) ?? 0}명 제출`;
      if (card.todo.kind === SESSION_ACTION_KIND.fillVacancy)
        notice = `대기 ${card.waitingCount}명`;
    } else if (host && !past && beforeResult) {
      primaryAction = {
        kind: SESSION_ACTION_KIND.fillVacancy,
        label: "참여자 관리",
        href: `/games/${game.id}/participants`,
      };
    }
    primaryAction ??= {
      kind: SESSION_ACTION_KIND.viewGame,
      label: "구인글 상세 보기",
      href: `/games/${game.id}`,
    };
  } else {
    primaryAction = null;
  }

  const confirmedViewer = game.participants.some(
    (p) => p.userId === context.viewerId && p.status === "confirmed",
  );
  const capacity: GameCapacityProps = {
    status: deriveGameStatus({ ...game, participantCount: confirmed }),
    recruitMethod: game.recruitMethod,
    confirmed,
    waiting,
    maxPlayers: game.maxPlayers,
    ended: past && !card.cancelled,
    past,
    isPrivate: game.visibility === GAME_VISIBILITY.private,
    display: !beforeResult && (host || confirmedViewer) ? "confirmed" : "default",
  };
  return {
    rule: game.rule,
    calendar: past ? card.schedule : line.text,
    notice,
    capacity,
    primaryAction,
  };
}
