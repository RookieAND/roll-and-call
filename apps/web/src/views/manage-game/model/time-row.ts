import { awaitingResultMethod } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { isDeadlinePassed, isSessionStarted, SCHEDULE_MODE } from "@/entities/game";
import { CLOCK_PARTICLE_KIND, clockParticle, formatDateTime, toKst } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

export function timeRow({ game, now }: { game: GameDetailData; now: Date }): ManageRow {
  const base = { key: "time", label: "세션 시간 정하기", icon: "clock" } as const;
  const confirmPath = `/games/${game.id}/confirm`;

  const isFixed = game.scheduleMode === SCHEDULE_MODE.fixed;
  const awaitingResult = awaitingResultMethod(game);
  if (!isFixed && awaitingResult) {
    return {
      ...base,
      state: MANAGE_ROW_STATE.locked,
      href: null,
      detail: awaitingResult === "lottery" ? "추첨을 먼저 마쳐 주세요" : "선발을 먼저 마쳐 주세요",
    };
  }

  if (isNil(game.confirmedAt)) {
    const overdue = isDeadlinePassed(game.endDate, now);
    return {
      ...base,
      state: overdue ? MANAGE_ROW_STATE.blocked : MANAGE_ROW_STATE.open,
      href: confirmPath,
      detail: overdue
        ? "조율 기한이 지났습니다 · 세션 일시를 빨리 정해 주세요"
        : "받은 가능 시간을 겹쳐 보고 세션 일시를 정합니다",
    };
  }

  const when = formatDateTime(game.confirmedAt);
  const done = { ...base, icon: "check", state: MANAGE_ROW_STATE.done, href: null } as const;

  if (!isSessionStarted(game, now)) {
    return {
      ...base,
      label: "세션 시간 바꾸기",
      state: MANAGE_ROW_STATE.open,
      href: confirmPath,
      detail: `${when} · 시작 전까지 바꿀 수 있습니다`,
    };
  }
  const clock = toKst(game.confirmedAt).format("HH:mm");
  const particle = clockParticle({ clock, kind: CLOCK_PARTICLE_KIND.direction });
  return { ...done, detail: `${when}${particle} 정했습니다` };
}
