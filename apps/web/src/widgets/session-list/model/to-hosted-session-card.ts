import { deriveGameStatus, gameStatusColor, gameStatusLabel, SESSION_STATE } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import {
  SESSION_ACTION_KIND,
  SESSION_BUCKET,
  SESSION_CHIP,
  SESSION_TONE,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

export function toHostedSessionCard(
  game: SessionGame,
  facts: SessionFacts,
  context: SessionContext,
): SessionCardModel {
  const {
    base,
    state,
    line,
    coordinate,
    confirmedCount,
    awaitingTime,
    timeSet,
    sessionWhen,
    seats,
  } = facts;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmedCount,
    waitlistEnabled: game.waitlistEnabled,
  });
  const responses = context.responseCounts.get(game.id) ?? 0;
  const gmTodo = awaitingTime && !context.readOnly;
  const scheduleTone = gmTodo
    ? SESSION_TONE.warning
    : line.confirmed
      ? SESSION_TONE.success
      : SESSION_TONE.normal;
  const awaitingTimeText = context.readOnly
    ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
    : "기한이 지났는데 세션 시간이 없습니다";

  return {
    ...base,
    bucket: SESSION_BUCKET.hosted,
    chip: state === SESSION_STATE.confirmed ? SESSION_CHIP.confirmed : SESSION_CHIP.recruiting,
    badge: gameStatusLabel[status],
    badgeColor: gameStatusColor[status],
    schedule: awaitingTime
      ? awaitingTimeText
      : (sessionWhen ?? joinParts(line.text, line.deadline)),
    scheduleTone,
    meta: joinParts(
      game.rule,
      !context.readOnly && coordinate && !timeSet && `응답 ${responses}/${confirmedCount}`,
      `확정 ${seats}`,
    ),
    action: gmTodo
      ? {
          kind: SESSION_ACTION_KIND.confirmTime,
          label: "세션 시간 확정하기",
          href: facts.scheduleHref,
        }
      : null,
    sortKey: facts.sortKey,
  };
}
