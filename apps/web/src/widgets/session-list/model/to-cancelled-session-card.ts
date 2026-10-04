import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { formatDate } from "@/shared/lib";

import { cancelSentence } from "./cancel-sentence";
import { joinParts } from "./join-parts";
import {
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
  type SessionCardModel,
  type SessionGame,
} from "./session-card-model";

// 취소된 구인은 흐린 카드로 종료 칩에 남는다(D286). 끝난 날짜는 취소한 날이다(D53).
export function toCancelledSessionCard({
  game,
  role,
}: {
  game: SessionGame;
  role: SessionRole;
}): SessionCardModel {
  const cancelledAt = new Date(game.cancelledAt!);
  return {
    id: game.id,
    title: game.title,
    role,
    chip: SESSION_CHIP.ended,
    badge: "취소됨",
    badgeColor: "gray",
    schedule: joinParts(formatDate(cancelledAt), cancelSentence(game)),
    scheduleTone: SESSION_TONE.muted,
    scheduleIcon: SESSION_ICON.calendar,
    gm: role === SESSION_ROLE.player ? (game.gm ?? null) : null,
    titleDanger: false,
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
