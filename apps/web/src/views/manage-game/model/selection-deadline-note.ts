import { selectionDeadline } from "@roll-and-call/database/games/model";

import { toKst } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import type { ManageDeadlineNote } from "./manage-summary";

const DAY_MS = 24 * 60 * 60 * 1000;

export function selectionDeadlineNote(game: GameDetailData, now: Date): ManageDeadlineNote {
  const deadline = selectionDeadline(game);
  return {
    text: `${toKst(deadline).format("M월 D일")}까지 선발을 마쳐 주세요.`,
    urgent: deadline.getTime() - now.getTime() <= DAY_MS,
  };
}
