import type { GameDetailData } from "@/shared/server";

import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

export function attendanceRow({
  game,
  ended,
  confirmedCount,
}: {
  game: GameDetailData;
  ended: boolean;
  confirmedCount: number;
}): ManageRow {
  const base = {
    key: "attendance",
    icon: "clipboard",
    label: "출석 확인",
    href: `/games/${game.id}/attendance`,
  } as const;
  const locked = { state: MANAGE_ROW_STATE.locked, href: null } as const;
  if (!ended) return { ...base, ...locked, detail: "세션이 끝난 뒤에 쓸 수 있습니다" };
  if (game.attendanceConfirmedAt) {
    return { ...base, state: MANAGE_ROW_STATE.done, detail: "출석을 정리했습니다" };
  }
  if (confirmedCount === 0) return { ...base, ...locked, detail: "확정 참여자가 없습니다" };
  return {
    ...base,
    state: MANAGE_ROW_STATE.open,
    detail: "세션이 끝났습니다 · 참석·불참을 표시해주세요",
  };
}
