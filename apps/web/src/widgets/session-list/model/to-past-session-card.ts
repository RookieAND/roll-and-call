import { SESSION_ROLE, SESSION_STATE, splitRoster } from "@/entities/game";
import { ddayKst, formatDate, formatDateTime } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { hostMenuAction } from "./host-menu-action";
import { joinParts } from "./join-parts";
import { relativeDay } from "./relative-day";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
  type SessionTodo,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

// 종료는 한 칩 안에 여러 사정이 들어온다 — 완료 · 무산 · 대기 종료 · 불참. 불참만 붉고 나머지는 무채색이며, 일정 줄이 왜 끝났는지 말한다.
export function toPastSessionCard(
  game: SessionGame,
  facts: SessionFacts,
  context: SessionContext,
): SessionCardModel {
  const { base, state, viewerAbsent } = facts;
  const finished = state === SESSION_STATE.finished && game.confirmedAt;
  const player = base.role === SESSION_ROLE.player;
  const waitlistRank = player
    ? (splitRoster(game.participants).waiting.find(
        (participant) => participant.userId === context.viewerId,
      )?.waitlistRank ?? null)
    : null;
  const absent = player && viewerAbsent && Boolean(game.confirmedAt);

  // 끝난 카드는 "언제였는지"가 제일 먼저 궁금하다 — 상대 날짜를 일정 줄 끝에 붙인다.
  const when = game.confirmedAt ? formatDateTime(game.confirmedAt) : null;
  const ago = game.confirmedAt
    ? relativeDay(ddayKst(game.confirmedAt, context.now ?? new Date()))
    : null;
  const ending = waitlistRank
    ? { badge: "대기 종료", schedule: joinParts(when, "자리가 나지 않은 채 끝났습니다") }
    : absent
      ? { badge: "불참", schedule: joinParts(when, "참석하지 않았습니다", ago) }
      : finished
        ? { badge: "완료", schedule: joinParts(when, "세션을 마쳤습니다", ago) }
        : {
            badge: "무산",
            schedule: joinParts(formatDate(game.endDate), "일정을 정하지 못했습니다"),
          };

  const attendanceTodo: SessionTodo | null =
    !player && facts.attendanceDue && !context.readOnly
      ? {
          kind: SESSION_ACTION_KIND.confirmAttendance,
          label: "출석 확인",
          href: `/games/${game.id}/attendance`,
          blocked: false,
          lines: [
            `${formatDateTime(game.confirmedAt!)} 세션이 끝났습니다.`,
            `확정 참여자 ${facts.confirmedCount}명이 왔는지 표시해주세요.`,
          ],
        }
      : null;

  return {
    ...base,
    chip: SESSION_CHIP.ended,
    badge: ending.badge,
    badgeColor: absent ? "danger" : "gray",
    titleDanger: absent,
    schedule: attendanceTodo ? joinParts(when, "출석 확인이 남아 있습니다") : ending.schedule,
    scheduleTone: absent
      ? SESSION_TONE.danger
      : attendanceTodo
        ? SESSION_TONE.warning
        : SESSION_TONE.muted,
    scheduleIcon: attendanceTodo ? SESSION_ICON.alert : SESSION_ICON.calendar,
    gm: player ? (game.gm ?? null) : null,
    // 운영 카드의 버튼은 언제나 "운영 관리" 하나다. 출석 확인은 그 안과 할 일 카드에서 한다.
    action: player || context.readOnly ? null : hostMenuAction(game.id),
    todo: attendanceTodo,
    waitingCount: facts.waitingCount,
    // 부호를 뒤집어 최근에 끝난 것부터 온다.
    sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
  };
}
