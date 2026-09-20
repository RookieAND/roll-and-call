import { absenceExpiresAt, SESSION_ROLE, SESSION_STATE, splitRoster } from "@/entities/game";
import { formatDate, formatDateTime } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_TONE,
  type SessionAction,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

// 종료은 한 칩 안에 여러 사정이 들어온다 — 완료 · 무산 · 대기 종료 · 불참. 배지는 모두 무채색이고 본문이 왜 끝났는지 말한다.
export function toPastSessionCard(
  game: SessionGame,
  facts: SessionFacts,
  context: SessionContext,
): SessionCardModel {
  const { base, seats, state, viewerAbsent } = facts;
  const finished = state === SESSION_STATE.finished && game.confirmedAt;
  const player = base.role === SESSION_ROLE.player;
  const gmPart = player && `GM ${game.gm?.username ?? "?"}`;
  const waitlistRank = player
    ? (splitRoster(game.participants).waiting.find(
        (participant) => participant.userId === context.viewerId,
      )?.waitlistRank ?? null)
    : null;
  const absent = player && viewerAbsent && Boolean(game.confirmedAt);

  const ending = waitlistRank
    ? {
        badge: "대기 종료",
        schedule: "자리가 나지 않은 채 세션이 끝났습니다",
        tail: `대기 ${waitlistRank}번`,
      }
    : absent
      ? {
          badge: "불참",
          schedule: `${formatDateTime(game.confirmedAt!)} · 참석하지 않았습니다`,
          tail: seats,
        }
      : finished
        ? {
            badge: "완료",
            schedule: `${formatDateTime(game.confirmedAt!)} · 세션 완료`,
            tail: seats,
          }
        : {
            badge: "무산",
            schedule: `${formatDate(game.endDate)}에 일정을 정하지 못했습니다`,
            tail: seats,
          };

  // 기간보다 언제 없어지는지가 알고 싶은 것이다. 남의 프로필에는 적지 않는다.
  const note =
    absent && !context.readOnly
      ? `이 기록은 ${formatDate(absenceExpiresAt(game.confirmedAt!))}에 사라집니다.\n완료 세션 수에는 세지 않습니다.`
      : null;

  const attendanceTodo: SessionAction | null =
    !player && facts.attendanceDue && !context.readOnly
      ? {
          kind: SESSION_ACTION_KIND.confirmAttendance,
          label: "출석 확인하기",
          href: `/games/${game.id}/attendance`,
        }
      : null;

  return {
    ...base,
    chip: SESSION_CHIP.ended,
    badge: ending.badge,
    badgeColor: "gray",
    schedule: attendanceTodo
      ? `${formatDateTime(game.confirmedAt!)} · 출석 확인이 남아 있습니다`
      : ending.schedule,
    scheduleTone: attendanceTodo ? SESSION_TONE.warning : SESSION_TONE.hint,
    meta: joinParts(gmPart, ending.tail),
    note,
    // 기록을 보는 자리라 여기서 할 일이 없다. 출석 확인만 예외다.
    action: attendanceTodo,
    todo: attendanceTodo,
    waitingCount: facts.waitingCount,
    // 부호를 뒤집어 최근에 끝난 것부터 온다.
    sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
  };
}
