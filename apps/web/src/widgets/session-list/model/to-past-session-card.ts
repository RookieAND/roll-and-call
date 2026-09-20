import { absenceExpiresAt, SESSION_ROLE, SESSION_STATE, splitRoster } from "@/entities/game";
import { ddayKst, formatDate, formatDateTime } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import { relativeDay } from "./relative-day";
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
  const waitlistRank = player
    ? (splitRoster(game.participants).waiting.find(
        (participant) => participant.userId === context.viewerId,
      )?.waitlistRank ?? null)
    : null;
  const absent = player && viewerAbsent && Boolean(game.confirmedAt);

  // 끝난 카드는 "언제였는지"가 제일 먼저 궁금하다 — 상대 날짜를 일정 줄 끝에 붙인다.
  const ago = game.confirmedAt
    ? relativeDay(ddayKst(game.confirmedAt, context.now ?? new Date()))
    : null;
  const ending = waitlistRank
    ? {
        badge: "대기 종료",
        schedule: "자리가 나지 않은 채 세션이 끝났습니다",
        counts: [{ label: "대기", value: `${waitlistRank}번` }],
      }
    : absent
      ? {
          badge: "불참",
          schedule: joinParts(formatDateTime(game.confirmedAt!), "참석하지 않았습니다", ago),
          counts: [{ label: null, value: seats }],
        }
      : finished
        ? {
            badge: "완료",
            schedule: joinParts(formatDateTime(game.confirmedAt!), "세션 완료", ago),
            counts: [{ label: null, value: seats }],
          }
        : {
            badge: "무산",
            schedule: `${formatDate(game.endDate)}에 일정을 정하지 못했습니다`,
            counts: [{ label: null, value: seats }],
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
    gm: player ? (game.gm ?? null) : null,
    counts: ending.counts,
    note,
    // 기록을 보는 자리라 여기서 할 일이 없다. 출석 확인만 예외다.
    action: attendanceTodo,
    todo: attendanceTodo,
    waitingCount: facts.waitingCount,
    // 부호를 뒤집어 최근에 끝난 것부터 온다.
    sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
  };
}
