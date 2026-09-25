import { deriveGameStatus, gameStatusColor, gameStatusLabel, SESSION_STATE } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { hostMenuAction } from "./host-menu-action";
import { hostTodo } from "./host-todo";
import { joinParts } from "./join-parts";
import {
  SESSION_CHIP,
  SESSION_ICON,
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
    confirmedCount,
    awaitingTime,
    drawPending,
    timeSet,
    sessionWhen,
    sessionAgo,
    waitingCount,
  } = facts;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmedCount,
    waitlistEnabled: game.waitlistEnabled,
    scheduleMode: game.scheduleMode,
    confirmedAt: game.confirmedAt,
  });
  // 사람은 모였고 시간만 남은 구인이 조율 중이다. 추첨을 기다리는 구인은 아직 사람을 고르는 중이라 모집 중에 둔다.
  const hostChip =
    state === SESSION_STATE.confirmed
      ? SESSION_CHIP.confirmed
      : state === SESSION_STATE.scheduling || state === SESSION_STATE.pendingConfirm || awaitingTime
        ? SESSION_CHIP.scheduling
        : SESSION_CHIP.recruiting;
  const responses = context.responseCounts.get(game.id) ?? 0;
  const todo = context.readOnly ? null : hostTodo(game, facts, responses);
  // 막혀 있는 일은 목록 카드도 붉게 칠한다 — 할 일 카드와 같은 신호다.
  const gmTodo = todo?.blocked ?? false;
  const scheduleTone = gmTodo
    ? SESSION_TONE.danger
    : timeSet
      ? SESSION_TONE.strong
      : SESSION_TONE.muted;
  const scheduleIcon = gmTodo
    ? SESSION_ICON.alert
    : timeSet
      ? SESSION_ICON.calendar
      : SESSION_ICON.clock;
  const awaitingTimeText = context.readOnly
    ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
    : "조율 기한이 지났습니다 · 세션 일시를 정해주세요";
  const drawPendingText = context.readOnly
    ? "모집이 끝나 GM이 추첨하는 중입니다"
    : "신청이 마감됐습니다 · 참여자를 뽑아주세요";

  return {
    ...base,
    urgent: gmTodo,
    chip: hostChip,
    badge: gameStatusLabel[status],
    badgeColor: gameStatusColor[status],
    schedule: drawPending
      ? drawPendingText
      : awaitingTime
        ? awaitingTimeText
        : sessionWhen
          ? joinParts(sessionWhen, sessionAgo)
          : joinParts(line.text, line.deadline),
    scheduleTone,
    scheduleIcon,
    // 운영 탭은 내가 GM이라 GM 줄을 적지 않는다.
    gm: null,
    action: context.readOnly ? null : hostMenuAction(game.id),
    todo,
    waitingCount,
    sortKey: facts.sortKey,
  };
}
