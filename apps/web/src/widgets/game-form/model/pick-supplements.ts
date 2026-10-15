import { isNull } from "es-toolkit";

import type { SupplementOption } from "@/entities/rulebook";
import type { SupplementValue } from "@/features/write-game";

// 시트에서 고른 책으로 등록된 줄을 바꾼다. 등록된 책은 목록 순서대로 앞에, 직접 입력한 책은 뒤에 둔다.
// 시트에 나오지 않는 책(그사이 숨겨진 책)은 시트로 뺄 수 없으므로 그대로 남긴다.
export function pickSupplements({
  items,
  options,
  ids,
}: {
  items: SupplementValue[];
  options: SupplementOption[];
  ids: string[];
}): SupplementValue[] {
  const picked = options
    .filter((option) => ids.includes(option.id))
    .map((option) => ({ name: option.name, rulebookId: option.id }));
  const unlisted = items.filter(
    (item) => !isNull(item.rulebookId) && !options.some((option) => option.id === item.rulebookId),
  );
  const manual = items.filter((item) => isNull(item.rulebookId));
  return [...picked, ...unlisted, ...manual];
}
