import { splitRoster } from "@/entities/game";

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

export function toJoinedSessionCard(
  game: SessionGame,
  facts: SessionFacts,
  context: SessionContext,
): SessionCardModel {
  const { base, line, awaitingTime, timeSet, sessionWhen, seats, sortKey } = facts;
  const meta = joinParts(game.rule, `GM ${game.gm?.username ?? "?"}`, seats);
  const common = { ...base, bucket: SESSION_BUCKET.joined, meta, sortKey };
  const { waiting } = splitRoster(game.participants);
  const waitlistRank =
    waiting.find((participant) => participant.userId === context.viewerId)?.waitlistRank ?? null;

  if (waitlistRank !== null) {
    return {
      ...common,
      chip: SESSION_CHIP.waiting,
      badge: `대기 ${waitlistRank}번`,
      badgeColor: "gray",
      schedule: sessionWhen ?? joinParts(line.text, line.deadline),
      scheduleTone: SESSION_TONE.normal,
      action: null,
    };
  }

  if (timeSet) {
    return {
      ...common,
      chip: SESSION_CHIP.confirmed,
      badge: "확정",
      badgeColor: "success",
      schedule: sessionWhen!,
      scheduleTone: SESSION_TONE.success,
      action: null,
    };
  }

  const needsResponse =
    !context.readOnly && !context.respondedGameIds.has(game.id) && !line.deadlinePassed;
  const schedule = needsResponse
    ? joinParts("가능 시간 미제출", line.deadline)
    : awaitingTime
      ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
      : joinParts(line.text, line.deadline);

  return {
    ...common,
    chip: SESSION_CHIP.scheduling,
    badge: "조율 중",
    badgeColor: "primary",
    schedule,
    scheduleTone: needsResponse ? SESSION_TONE.warning : SESSION_TONE.normal,
    action: needsResponse
      ? {
          kind: SESSION_ACTION_KIND.submitAvailability,
          label: "일정 조율",
          href: facts.scheduleHref,
        }
      : null,
  };
}
