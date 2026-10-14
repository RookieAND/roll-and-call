import { SUPPLEMENT_OPTION_STATE, supplementOptions, type EditionSet } from "@/entities/rulebook";
import type { Game } from "@/shared/server";

export function openSupplements({
  supplements,
  set,
}: {
  supplements: Game["supplements"];
  set: EditionSet;
}) {
  const openIds = new Set(
    supplementOptions(set)
      .filter((option) => option.state === SUPPLEMENT_OPTION_STATE.open)
      .map((option) => option.id),
  );
  return supplements.filter((item) => item.rulebookId === null || openIds.has(item.rulebookId));
}
