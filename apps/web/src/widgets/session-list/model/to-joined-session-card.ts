import { RECRUIT_METHOD, splitRoster } from "@/entities/game";
import { ddayKst, formatDate } from "@/shared/lib";

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

export function toJoinedSessionCard(
  game: SessionGame,
  facts: SessionFacts,
  context: SessionContext,
): SessionCardModel {
  const { base, line, awaitingTime, timeSet, sessionWhen, sessionAgo, sortKey, waitingCount } =
    facts;
  const common = { ...base, gm: game.gm ?? null, sortKey, waitingCount, todo: null };
  const { waiting } = splitRoster(game.participants);
  const mine = waiting.find((participant) => participant.userId === context.viewerId) ?? null;

  if (mine !== null) {
    const cancel = (label: string) =>
      context.readOnly
        ? null
        : { kind: SESSION_ACTION_KIND.cancelWaitlist, label, href: `/games/${game.id}` };

    // 추첨은 뽑기 전까지 순번이 없다 — 대기가 아니라 "신청"이라 버튼도 다르다.
    if (game.recruitMethod === RECRUIT_METHOD.lottery && game.drawnAt === null) {
      return {
        ...common,
        chip: SESSION_CHIP.waiting,
        badge: "추첨 전",
        badgeColor: "gray",
        schedule: line.deadlinePassed
          ? "모집이 끝나 GM이 추첨하는 중입니다"
          : joinParts(`${formatDate(game.endDate)} 신청 마감`, "마감 뒤 GM이 뽑습니다"),
        scheduleTone: SESSION_TONE.muted,
        scheduleIcon: SESSION_ICON.clock,
        action: cancel("신청 취소"),
      };
    }

    // 승인 대기(GM이 아직 보지 않음)와 정원 대기(순번)는 배지로만 갈리고 버튼은 하나다.
    const seen = line.deadlinePassed || timeSet;
    return {
      ...common,
      chip: SESSION_CHIP.waiting,
      badge: seen ? `대기 ${mine.waitlistRank}번` : "승인 대기",
      waitlistRank: seen ? mine.waitlistRank : null,
      badgeColor: seen ? "warning" : "gray",
      schedule: seen
        ? "정원이 차 순서를 기다립니다 · 자리가 나면 알립니다"
        : joinParts(
            `신청한 지 ${1 - ddayKst(mine.joinedAt, context.now ?? new Date())}일째입니다`,
            "GM이 아직 보지 않았습니다",
          ),
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

  // 아직 가능 시간을 안 냈으면 기한과 상관없이 막힌 일이다 — 카드를 붉게 칠한다.
  const needsResponse =
    !context.readOnly && !context.respondedGameIds.has(game.id) && !line.deadlinePassed;
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
      schedule: `${formatDate(game.endDate)}까지 가능 시간을 내야 합니다`,
      scheduleTone: SESSION_TONE.danger,
      scheduleIcon: SESSION_ICON.alert,
      action: submit,
      todo: {
        ...submit,
        blocked: false,
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
