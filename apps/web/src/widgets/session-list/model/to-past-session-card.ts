import { SESSION_ROLE, SESSION_STATE, splitRoster } from "@/entities/game";
import { formatDate, formatDateTime } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";
import { joinParts } from "./join-parts";
import {
  SESSION_CHIP,
  SESSION_TONE,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

// 종료은 한 칩 안에 여러 사정이 들어온다 — 완료 · 무산 · 대기 종료. 배지는 모두 무채색이고 본문이 왜 끝났는지 말한다.
export function toPastSessionCard(
  game: SessionGame,
  facts: SessionFacts,
  context: SessionContext,
): SessionCardModel {
  const { base, seats, state } = facts;
  const finished = state === SESSION_STATE.finished && game.confirmedAt;
  const player = base.role === SESSION_ROLE.player;
  const gmPart = player && `GM ${game.gm?.username ?? "?"}`;
  const waitlistRank = player
    ? (splitRoster(game.participants).waiting.find(
        (participant) => participant.userId === context.viewerId,
      )?.waitlistRank ?? null)
    : null;

  const ending = waitlistRank
    ? {
        badge: "대기 종료",
        schedule: "자리가 나지 않은 채 세션이 끝났습니다",
        tail: `대기 ${waitlistRank}번`,
      }
    : finished
      ? {
          badge: "완료",
          schedule: `${formatDateTime(game.confirmedAt!)} · 세션 완료`,
          tail: seats,
        }
      : {
          badge: "무산",
          schedule: `${formatDate(game.endDate)}에 일정을 정하지 못했습니다`,
          tail: seats,
        };

  return {
    ...base,
    chip: SESSION_CHIP.ended,
    badge: ending.badge,
    badgeColor: "gray",
    schedule: ending.schedule,
    scheduleTone: SESSION_TONE.hint,
    meta: joinParts(game.rule, gmPart, ending.tail),
    // 기록을 보는 자리라 여기서 할 일이 없다.
    action: null,
    todo: null,
    waitingCount: facts.waitingCount,
    // 부호를 뒤집어 최근에 끝난 것부터 온다.
    sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
  };
}
