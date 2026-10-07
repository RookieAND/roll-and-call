import { deriveGameStatus, GAME_STATUS, gameStatusColor, gameStatusLabel } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { hostMenuAction } from "./host-menu-action";
import { hostSchedule } from "./host-schedule";
import { hostScheduleIcon } from "./host-schedule-icon";
import { hostScheduleTone } from "./host-schedule-tone";
import { hostSessionChip } from "./host-session-chip";
import { hostTodo } from "./host-todo";
import { type SessionCardModel, type SessionContext, type SessionGame } from "./session-card-model";

export function toHostedSessionCard({
  game,
  facts,
  context,
}: {
  game: SessionGame;
  facts: SessionFacts;
  context: SessionContext;
}): SessionCardModel {
  const { base, state, confirmedCount, awaitingTime, timeSet, waitingCount } = facts;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmedCount,
    waitlistEnabled: game.waitlistEnabled,
    scheduleMode: game.scheduleMode,
    confirmedAt: game.confirmedAt,
    cancelledAt: game.cancelledAt,
  });
  // 추첨 글은 마감 뒤에도 추첨 전까지 「모집 중」이다(D254).
  const badgeStatus = facts.lotteryOpen ? GAME_STATUS.recruiting : status;
  const hostChip = hostSessionChip({ state, awaitingTime });
  const todo = context.readOnly ? null : hostTodo({ game, facts, now: context.now ?? new Date() });
  const gmTodo = !facts.lotteryOpen && (todo?.blocked ?? false);
  const timeShown = timeSet && !facts.lotteryOpen;
  const scheduleTone = hostScheduleTone({ gmTodo, timeSet: timeShown });
  const scheduleIcon = hostScheduleIcon({ gmTodo, timeSet: timeShown });

  return {
    ...base,
    urgent: gmTodo,
    chip: hostChip,
    badge: gameStatusLabel[badgeStatus],
    badgeColor: gameStatusColor[badgeStatus],
    schedule: hostSchedule({ facts, endDate: game.endDate, readOnly: context.readOnly }),
    scheduleTone,
    scheduleIcon,
    gm: null,
    action: context.readOnly ? null : hostMenuAction(game.id),
    todo,
    waitingCount,
    sortKey: facts.sortKey,
  };
}
