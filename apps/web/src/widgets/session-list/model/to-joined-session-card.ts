import { isNull } from "es-toolkit";

import { RECRUIT_METHOD, splitRoster } from "@/entities/game";
import { formatDate } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

export function toJoinedSessionCard({
  game,
  facts,
  context,
}: {
  game: SessionGame;
  facts: SessionFacts;
  context: SessionContext;
}): SessionCardModel {
  const { base, line, awaitingTime, timeSet, sessionWhen, sessionAgo, sortKey, waitingCount } =
    facts;
  const common = { ...base, gm: game.gm ?? null, sortKey, waitingCount, todo: null };
  const { waiting } = splitRoster(game.participants);
  const mine = waiting.find((participant) => participant.userId === context.viewerId) ?? null;

  if (!isNull(mine)) {
    const cancel = (label: string) =>
      context.readOnly
        ? null
        : { kind: SESSION_ACTION_KIND.cancelWaitlist, label, href: `/games/${game.id}` };

    if (game.recruitMethod === RECRUIT_METHOD.selection && isNull(game.selectionFinishedAt)) {
      return {
        ...common,
        chip: SESSION_CHIP.waiting,
        badge: "선발 전",
        badgeColor: "gray",
        schedule: line.deadlinePassed
          ? "모집이 끝나 GM이 선발하는 중입니다"
          : joinParts(`${formatDate(game.endDate)} 신청 마감`, "마감 뒤 GM이 선발합니다"),
        scheduleTone: SESSION_TONE.muted,
        scheduleIcon: SESSION_ICON.clock,
        action: line.deadlinePassed ? null : cancel("신청 취소"),
      };
    }

    if (game.recruitMethod === RECRUIT_METHOD.lottery && isNull(game.drawnAt)) {
      return {
        ...common,
        chip: SESSION_CHIP.waiting,
        badge: "추첨 전",
        badgeColor: "gray",
        schedule: line.deadlinePassed
          ? "모집이 끝나 곧 추첨합니다"
          : joinParts(`${formatDate(game.endDate)} 신청 마감`, "마감 때 추첨합니다"),
        scheduleTone: SESSION_TONE.muted,
        scheduleIcon: SESSION_ICON.clock,
        action: line.deadlinePassed ? null : cancel("신청 취소"),
      };
    }

    return {
      ...common,
      chip: SESSION_CHIP.waiting,
      badge: `대기 ${mine.waitlistRank}번`,
      waitlistRank: mine.waitlistRank,
      badgeColor: "warning",
      schedule: "정원이 차 순서를 기다립니다 · 자리가 나면 알립니다",
      scheduleTone: SESSION_TONE.muted,
      scheduleIcon: SESSION_ICON.clock,
      action: cancel("대기 취소"),
    };
  }

  if (timeSet) {
    return {
      ...common,
      chip: SESSION_CHIP.confirmed,
      badge: "확정",
      badgeColor: "success",
      schedule: joinParts(sessionWhen!, sessionAgo),
      scheduleTone: SESSION_TONE.strong,
      scheduleIcon: SESSION_ICON.calendar,
      action: null,
    };
  }

  const needsResponse =
    !context.readOnly && !context.respondedGameIds.has(game.id) && !line.deadlinePassed;
  const cancelled = !isNull(game.cancelledAt);
  const submit = {
    kind: SESSION_ACTION_KIND.submitAvailability,
    label: "일정 조율",
    href: facts.scheduleHref,
  };

  if (needsResponse) {
    return {
      ...common,
      urgent: true,
      chip: SESSION_CHIP.scheduling,
      badge: "조율 중",
      badgeColor: "primary",
      schedule: `${formatDate(game.endDate)}까지 조율 격자에 일정을 설정해야 합니다`,
      scheduleTone: SESSION_TONE.danger,
      scheduleIcon: SESSION_ICON.alert,
      action: submit,
      todo: cancelled
        ? null
        : {
            ...submit,
            blocked: false,
            sortAt: new Date(game.endDate).toISOString(),
            lines: [
              "아직 가능 시간을 내지 않았습니다.",
              `${formatDate(game.endDate)}까지 내면 됩니다.`,
            ],
          },
    };
  }

  return {
    ...common,
    chip: SESSION_CHIP.scheduling,
    badge: "조율 중",
    badgeColor: "primary",
    schedule: awaitingTime
      ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
      : joinParts(line.text, line.deadline),
    scheduleTone: SESSION_TONE.muted,
    scheduleIcon: SESSION_ICON.clock,
    action: null,
  };
}
