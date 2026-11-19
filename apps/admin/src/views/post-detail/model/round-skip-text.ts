import { formatDateWeekday, toKst } from "@roll-and-call/app-kit/date";
import { clockTextLabel } from "@roll-and-call/database/games/model";

import type { AdminRoundSkip } from "./admin-rounds";

const clockOf = (value: Date) => clockTextLabel(toKst(value).format("HH:mm"));

// 「10월 24일 (토) 오후 12:00 · 10월 25일 오전 9:12에 생략」
export function roundSkipText(skip: AdminRoundSkip) {
  const original = `${formatDateWeekday(skip.originalStartAt)} ${clockOf(skip.originalStartAt)}`;
  const skipped = `${toKst(skip.skippedAt).format("M월 D일")} ${clockOf(skip.skippedAt)}`;
  return `${original} · ${skipped}에 생략`;
}
