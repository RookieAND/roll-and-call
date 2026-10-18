import type { GameSupplement } from "#db/schema";

import { supplementNameKey } from "./supplement-name-key";

// 직접 입력한 줄을 등록된 룰북으로 바꾼다. 이미 그 룰북이 있으면 직접 입력한 줄만 뺀다. 바꿀 줄이 없으면 null.
export function replaceManualSupplement({
  supplements,
  name,
  rulebook,
}: {
  supplements: GameSupplement[];
  name: string;
  rulebook: { id: string; name: string };
}): GameSupplement[] | null {
  const key = supplementNameKey(name);
  const index = supplements.findIndex(
    (item) => item.rulebookId === null && supplementNameKey(item.name) === key,
  );
  if (index < 0) return null;
  if (supplements.some((item) => item.rulebookId === rulebook.id)) {
    return supplements.filter((_, position) => position !== index);
  }
  return supplements.map((item, position) =>
    position === index ? { name: rulebook.name, rulebookId: rulebook.id } : item,
  );
}
