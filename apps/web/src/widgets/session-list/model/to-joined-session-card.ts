import { splitRoster } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import {
  SESSION_ACTION_KIND,
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
  const { base, line, awaitingTime, timeSet, sessionWhen, seats, sortKey, waitingCount } = facts;
  const meta = joinParts(game.rule, `GM ${game.gm?.username ?? "?"}`, seats);
  const common = { ...base, meta, sortKey, waitingCount, todo: null };
  const { waiting } = splitRoster(game.participants);
  const waitlistRank =
    waiting.find((participant) => participant.userId === context.viewerId)?.waitlistRank ?? null;

  if (waitlistRank !== null) {
    // 승인 대기(GM이 아직 보지 않음)와 정원 대기(순번)는 배지로만 갈리고 버튼은 하나다.
    const seen = line.deadlinePassed || timeSet;
    return {
      ...common,
      chip: SESSION_CHIP.waiting,
      badge: seen ? `대기 ${waitlistRank}번` : "승인 대기",
      badgeColor: "gray",
      schedule: seen
        ? "정원이 차 순서를 기다립니다 · 자리가 나면 알립니다"
        : joinParts(line.text, line.deadline),
      scheduleTone: SESSION_TONE.normal,
      action: context.readOnly
        ? null
        : { kind: SESSION_ACTION_KIND.cancelWaitlist, label: "대기 취소", href: `/games/${game.id}` },
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
  const submit = {
    kind: SESSION_ACTION_KIND.submitAvailability,
    label: "일정 조율",
    href: facts.scheduleHref,
  };

  return {
    ...common,
    chip: SESSION_CHIP.scheduling,
    badge: "조율 중",
    badgeColor: "primary",
    schedule,
    scheduleTone: needsResponse ? SESSION_TONE.warning : SESSION_TONE.normal,
    action: needsResponse ? submit : null,
    todo: needsResponse ? submit : null,
  };
}
