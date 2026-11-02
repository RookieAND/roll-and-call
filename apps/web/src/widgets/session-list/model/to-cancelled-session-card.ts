import { SESSION_ROLE, type SessionRole, type SessionGame } from "@/entities/game";
import { formatMonthDay, formatMonthDayTime } from "@/shared/lib";

import { cancelSentence } from "./cancel-sentence";
import {
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
  type SessionCardBase,
} from "./session-card-model";

// 취소된 구인은 흐린 카드로 종료 칩에 남는다(D286). 끝난 날짜는 취소한 날이다(D53).
export function toCancelledSessionCard({
  game,
  role,
  cancelledAt,
}: {
  game: SessionGame;
  role: SessionRole;
  cancelledAt: Date;
}): SessionCardBase {
  return {
    id: game.id,
    title: game.title,
    role,
    chip: SESSION_CHIP.ended,
    badge: "취소됨",
    badgeColor: "danger",
    // 정해진 세션 시각이 있으면 그 시각에 「예정」을 붙이고, 없으면 취소한 날이다(D53).
    schedule: game.confirmedAt
      ? `${formatMonthDayTime(game.confirmedAt)} 예정`
      : formatMonthDay(cancelledAt),
    scheduleNote: cancelSentence(game),
    scheduleTone: SESSION_TONE.danger,
    scheduleIcon: SESSION_ICON.calendar,
    gm: role === SESSION_ROLE.player ? (game.gm ?? null) : null,
    titleDanger: true,
    urgent: false,
    cancelled: true,
    hidden: false,
    action: null,
    caption: null,
    todo: null,
    waitingCount: 0,
    waitlistRank: null,
    startsAt: null,
    deadlinePassed: true,
    sortKey: -cancelledAt.getTime(),
  };
}
