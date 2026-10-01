import { isNull, uniq } from "es-toolkit";

import type { AwardSheet } from "./award-sheet";
import type { HeldBadge } from "./held-badge";
import { singleAwardSheet } from "./single-award-sheet";
import { toAwardItem } from "./to-award-item";

export function buildAwardSheet(held: HeldBadge[]): AwardSheet | null {
  const pending = held.filter((badge) => isNull(badge.record.notifiedAt));
  if (pending.length === 0) return null;

  if (pending.length === 1) {
    return singleAwardSheet({ badge: pending[0]!, firstBadge: held.length === 1 });
  }

  // 한 번도 알린 적 없는 사람이 여럿을 한꺼번에 받았으면 출시 직후 지난 기록으로 채운 묶음이다.
  if (pending.length === held.length) return { kind: "retro", items: pending.map(toAwardItem) };

  const titles = uniq(pending.map((badge) => badge.record.source?.title ?? null));
  const [title] = titles;
  return {
    kind: "multi",
    items: pending.toSorted((left, right) => right.grade - left.grade).map(toAwardItem),
    subtitle: titles.length === 1 && title ? `${title} 출석 확인이 끝났습니다.` : null,
  };
}
