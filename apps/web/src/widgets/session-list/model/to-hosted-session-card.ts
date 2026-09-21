import { deriveGameStatus, gameStatusColor, gameStatusLabel, SESSION_STATE } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { hostTodo } from "./host-todo";
import { joinParts } from "./join-parts";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_ICON,
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
    drawPending,
    timeSet,
    sessionWhen,
    sessionAgo,
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
  const todo = context.readOnly ? null : hostTodo(game, facts, responses);
  // 막혀 있는 일은 목록 카드도 붉게 칠한다 — 할 일 카드와 같은 신호다.
  const gmTodo = todo?.blocked ?? false;
  const scheduleTone = gmTodo
    ? SESSION_TONE.danger
    : line.confirmed
      ? SESSION_TONE.success
      : SESSION_TONE.normal;
  const scheduleIcon = gmTodo
    ? SESSION_ICON.alert
    : line.confirmed
      ? SESSION_ICON.confirmed
      : SESSION_ICON.scheduling;
  const awaitingTimeText = context.readOnly
    ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
    : "조율 기한이 지났습니다 · 세션 일시를 정해주세요";
  const drawPendingText = context.readOnly
    ? "모집이 끝나 GM이 추첨하는 중입니다"
    : "신청이 마감됐습니다 · 참여자를 뽑아주세요";

  // 목록 카드에 버튼을 늘리지 않는다. GM 도구는 "운영 관리" 한 곳으로 모은다.
  const hostMenu: SessionAction = {
    kind: SESSION_ACTION_KIND.hostMenu,
    label: "운영 관리",
    href: `/games/${game.id}/manage`,
  };

  return {
    ...base,
    urgent: base.urgent || gmTodo,
    chip: state === SESSION_STATE.confirmed ? SESSION_CHIP.confirmed : SESSION_CHIP.recruiting,
    badge: gameStatusLabel[status],
    badgeColor: gameStatusColor[status],
    schedule: drawPending
      ? drawPendingText
      : awaitingTime
        ? awaitingTimeText
        : (sessionWhen ?? joinParts(line.text, line.deadline)),
    scheduleTail: awaitingTime || drawPending ? null : sessionAgo,
    scheduleTone,
    scheduleIcon,
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
