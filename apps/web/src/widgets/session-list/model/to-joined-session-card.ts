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
  const {
    base,
    line,
    awaitingTime,
    timeSet,
    sessionWhen,
    sessionAgo,
    seats,
    sortKey,
    waitingCount,
  } = facts;
  const gm = game.gm ?? null;
  const common = {
    ...base,
    gm,
    counts: [{ label: null, value: seats }],
    scheduleTail: null,
    sortKey,
    waitingCount,
    todo: null,
    note: null,
  };
  const { waiting } = splitRoster(game.participants);
  const mine = waiting.find((participant) => participant.userId === context.viewerId) ?? null;

  if (mine !== null) {
    const cancel = (label: string) =>
      context.readOnly
        ? null
        : { kind: SESSION_ACTION_KIND.cancelWaitlist, label, href: `/games/${game.id}` };

    // 추첨은 뽑기 전까지 순번이 없다 — 대기가 아니라 "신청"이라 세는 것도 버튼도 다르다.
    if (game.recruitMethod === RECRUIT_METHOD.lottery && game.drawnAt === null) {
      return {
        ...common,
        counts: [
          { label: null, value: `신청 ${game.participants.length} · 정원 ${game.maxPlayers}` },
        ],
        chip: SESSION_CHIP.waiting,
        badge: "추첨 전",
        badgeColor: "primary",
        schedule: line.deadlinePassed
          ? "모집이 끝나 GM이 추첨하는 중입니다"
          : joinParts(`${formatDate(game.endDate)} 신청 마감`, "마감 뒤 GM이 뽑습니다"),
        scheduleTone: SESSION_TONE.normal,
        scheduleIcon: SESSION_ICON.deadline,
        action: cancel("신청 취소"),
      };
    }

    // 승인 대기(GM이 아직 보지 않음)와 정원 대기(순번)는 배지로만 갈리고 버튼은 하나다.
    const seen = line.deadlinePassed || timeSet;
    return {
      ...common,
      chip: SESSION_CHIP.waiting,
      badge: seen ? `대기 ${mine.waitlistRank}번` : "승인 대기",
      badgeColor: "warning",
      schedule: seen
        ? "정원이 차 순서를 기다립니다 · 자리가 나면 알립니다"
        : joinParts(
            `신청 ${1 - ddayKst(mine.joinedAt, context.now ?? new Date())}일째`,
            "GM이 아직 보지 않았습니다",
          ),
      scheduleTone: seen ? SESSION_TONE.normal : SESSION_TONE.warning,
      scheduleIcon: seen ? SESSION_ICON.waitlist : SESSION_ICON.scheduling,
      action: cancel("대기 취소"),
    };
  }

  if (timeSet) {
    return {
      ...common,
      chip: SESSION_CHIP.confirmed,
      badge: "확정",
      badgeColor: "success",
      schedule: sessionWhen!,
      scheduleTail: sessionAgo,
      scheduleTone: SESSION_TONE.success,
      scheduleIcon: SESSION_ICON.confirmed,
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
    scheduleIcon: needsResponse ? SESSION_ICON.alert : SESSION_ICON.scheduling,
    action: needsResponse ? submit : null,
    todo: needsResponse ? submit : null,
  };
}
