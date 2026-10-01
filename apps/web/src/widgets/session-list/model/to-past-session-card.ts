import { SESSION_ROLE, SESSION_STATE, splitRoster } from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { hostMenuAction } from "./host-menu-action";
import { joinParts } from "./join-parts";
import { pastEnding } from "./past-ending";
import { pastScheduleTone } from "./past-schedule-tone";
import { relativeDay } from "./relative-day";
import { reviewNote } from "./review-note";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_ICON,
  type SessionTodo,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

export function toPastSessionCard({
  game,
  facts,
  context,
}: {
  game: SessionGame;
  facts: SessionFacts;
  context: SessionContext;
}): SessionCardModel {
  const { base, state, viewerAbsent } = facts;
  const finished = state === SESSION_STATE.finished && game.confirmedAt;
  const player = base.role === SESSION_ROLE.player;
  const waitlistRank = player
    ? (splitRoster(game.participants).waiting.find(
        (participant) => participant.userId === context.viewerId,
      )?.waitlistRank ?? null)
    : null;
  const absent = player && viewerAbsent && Boolean(game.confirmedAt);

  const when = game.confirmedAt ? formatDateTime(game.confirmedAt) : null;
  const ago = game.confirmedAt
    ? relativeDay(ddayKst(game.confirmedAt, context.now ?? new Date()))
    : null;
  const ending = pastEnding({
    waitlistRank,
    absent,
    finished: Boolean(finished),
    when,
    ago,
    endDate: game.endDate,
  });

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

  const review =
    player && finished && !absent && !waitlistRank
      ? reviewNote({ game, context })
      : { caption: null, action: null };
  const hostAction = context.readOnly ? null : hostMenuAction(game.id);
  const absentCaption = absent && !context.readOnly ? { text: "불참 처리됨", strong: false } : null;

  return {
    ...base,
    chip: SESSION_CHIP.ended,
    badge: ending.badge,
    badgeColor: absent ? "danger" : "gray",
    titleDanger: absent,
    schedule: attendanceTodo ? joinParts(when, "출석 확인이 남아 있습니다") : ending.schedule,
    scheduleTone: pastScheduleTone({ absent, attendancePending: Boolean(attendanceTodo) }),
    scheduleIcon: attendanceTodo ? SESSION_ICON.alert : SESSION_ICON.calendar,
    gm: player ? (game.gm ?? null) : null,
    action: player ? review.action : hostAction,
    caption: review.caption ?? absentCaption,
    todo: attendanceTodo,
    waitingCount: facts.waitingCount,
    // 부호를 뒤집어 최근에 끝난 것부터 온다.
    sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
  };
}
