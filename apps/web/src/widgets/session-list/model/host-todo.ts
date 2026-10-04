import { isNull } from "es-toolkit";

import { isSessionEnded, RECRUIT_METHOD } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { isTodoStale } from "./is-todo-stale";
import { SESSION_ACTION_KIND, type SessionGame, type SessionTodo } from "./session-card-model";

// 한 구인에서 GM의 일은 하나만 올린다. 대기자가 없는 결원은 할 일이 아니다.
export function hostTodo({
  game,
  facts,
  responses,
  now,
}: {
  game: SessionGame;
  facts: SessionFacts;
  responses: number;
  now: Date;
}): SessionTodo | null {
  if (!isNull(game.cancelledAt)) return null;
  const { confirmedCount, waitingCount } = facts;
  const endDate = new Date(game.endDate).toISOString();

  if (facts.awaitingTime) {
    if (isTodoStale(game.endDate, now)) return null;
    return {
      kind: SESSION_ACTION_KIND.confirmTime,
      label: "세션 시간 정하기",
      href: `/games/${game.id}/confirm`,
      blocked: true,
      sortAt: endDate,
      lines: [
        "조율 기한이 지났습니다.",
        `지금까지 ${responses}명이 낸 시간으로 일시를 정할 수 있습니다.`,
      ],
    };
  }

  const openSeats = game.maxPlayers - confirmedCount;
  const beforeDraw = game.recruitMethod === RECRUIT_METHOD.lottery && isNull(game.drawnAt);
  if (waitingCount === 0 || openSeats <= 0 || beforeDraw || isSessionEnded(game, now)) return null;
  return {
    kind: SESSION_ACTION_KIND.fillVacancy,
    label: "참여자 관리",
    href: `/games/${game.id}/participants`,
    blocked: false,
    sortAt: facts.base.startsAt ?? endDate,
    lines: [
      `확정 자리가 ${openSeats}개 비었습니다.`,
      `대기 중인 ${waitingCount}명 가운데 누구를 올릴지 정해 주세요.`,
    ],
  };
}
