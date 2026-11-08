import type { GameDetailData } from "@roll-and-call/database/games";

import { isSessionEnded, isSessionStarted } from "@/entities/game";

import {
  MANAGE_ROW_ACTION,
  MANAGE_ROW_DETAIL,
  MANAGE_ROW_STATE,
  type ManageRow,
} from "./manage-row-state";

export function endSessionRow({
  game,
  confirmedCount,
  now,
}: {
  game: GameDetailData;
  confirmedCount: number;
  now: Date;
}): ManageRow {
  const base = { key: "end", icon: "flag", label: "세션 마치기", href: null } as const;
  const locked = { ...base, state: MANAGE_ROW_STATE.locked } as const;

  if (isSessionEnded(game, now)) return { ...locked, detail: "세션이 끝났습니다" };
  if (!isSessionStarted(game, now))
    return { ...locked, detail: "세션이 시작되면 마칠 수 있습니다" };
  if (confirmedCount === 0) return { ...locked, detail: MANAGE_ROW_DETAIL.noConfirmed };
  return {
    ...base,
    state: MANAGE_ROW_STATE.open,
    detail: "세션을 지금 마칩니다",
    action: MANAGE_ROW_ACTION.endSession,
  };
}
