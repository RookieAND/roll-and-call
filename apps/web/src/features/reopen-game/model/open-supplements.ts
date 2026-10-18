import type { Game } from "@roll-and-call/database";
import { isNull } from "es-toolkit";

import { SUPPLEMENT_OPTION_STATE, supplementOptions, type EditionSet } from "@/entities/rulebook";

export function openSupplements({
  supplements,
  set,
  enforced,
}: {
  supplements: Game["supplements"];
  set: EditionSet;
  enforced: boolean;
}) {
  const openIds = new Set(
    supplementOptions(set, { enforced })
      .filter((option) => option.state === SUPPLEMENT_OPTION_STATE.open)
      .map((option) => option.id),
  );
  return supplements.filter((item) => isNull(item.rulebookId) || openIds.has(item.rulebookId));
}
