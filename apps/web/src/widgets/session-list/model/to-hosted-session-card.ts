import { deriveGameStatus, gameStatusColor, gameStatusLabel } from "@/entities/game";

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
  });
  const hostChip = hostSessionChip({ state, awaitingTime });
  const responses = context.responseCounts.get(game.id) ?? 0;
  const todo = context.readOnly ? null : hostTodo({ game, facts, responses });
  const gmTodo = todo?.blocked ?? false;
  const scheduleTone = hostScheduleTone({ gmTodo, timeSet });
  const scheduleIcon = hostScheduleIcon({ gmTodo, timeSet });

  return {
    ...base,
    urgent: gmTodo,
    chip: hostChip,
    badge: gameStatusLabel[status],
    badgeColor: gameStatusColor[status],
    schedule: hostSchedule({ facts, readOnly: context.readOnly }),
    scheduleTone,
    scheduleIcon,
    gm: null,
    action: context.readOnly ? null : hostMenuAction(game.id),
    todo,
    waitingCount,
    sortKey: facts.sortKey,
  };
}
