import { deriveGameStatus, gameStatusColor, gameStatusLabel, SESSION_STATE } from "@/entities/game";

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
    waitingCount,
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

  // 목록 카드에 버튼을 늘리지 않는다. GM 도구는 "운영 관리" 한 곳으로 모은다.
  const hostMenu: SessionAction = {
    kind: SESSION_ACTION_KIND.hostMenu,
    label: "운영 관리",
    href: `/games/${game.id}/manage`,
  };
  const todo: SessionAction | null = gmTodo
    ? {
        kind: SESSION_ACTION_KIND.confirmTime,
        label: "세션 시간 확정하기",
        href: facts.scheduleHref,
      }
    : null;

  return {
    ...base,
    chip: state === SESSION_STATE.confirmed ? SESSION_CHIP.confirmed : SESSION_CHIP.recruiting,
    badge: gameStatusLabel[status],
    badgeColor: gameStatusColor[status],
    schedule: awaitingTime
      ? awaitingTimeText
      : (sessionWhen ?? joinParts(line.text, line.deadline)),
    scheduleTone,
    // 운영 탭은 내가 GM이라 GM 줄을 적지 않는다.
    gm: null,
    counts: [
      ...(!context.readOnly && coordinate && !timeSet
        ? [{ label: "응답", value: `${responses}/${confirmedCount}` }]
        : []),
      { label: "확정", value: seats },
    ],
    note: null,
    action: context.readOnly ? null : hostMenu,
    todo,
    waitingCount,
    sortKey: facts.sortKey,
  };
}
