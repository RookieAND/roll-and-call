import type { GameSupplement } from "@roll-and-call/database";
import { supplementNameKey } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { SUPPLEMENT_OPTION_STATE, supplementOptions, type EditionSet } from "@/entities/rulebook";

import type { SupplementValue } from "./game-form";
import { manualSupplementError } from "./manual-supplement-error";

type CheckResult = { ok: true; supplements: GameSupplement[] } | { ok: false; error: string };

// 저장 직전에 서플리먼트를 다시 확인한다. 새로 넣는 등록된 책은 인증한 것만 받고, 직접 입력한 이름이 등록된 책이면 막는다.
// 이미 저장된 줄은 그 뒤 인증이 바뀌거나 같은 이름의 책이 등록돼도 그대로 둔다.
export function checkSupplements({
  supplements,
  set,
  previous = [],
  enforced,
}: {
  supplements: SupplementValue[];
  set: EditionSet | null;
  previous?: GameSupplement[];
  enforced: boolean;
}): CheckResult {
  const options = set ? supplementOptions(set, { enforced }) : [];
  const accepted: GameSupplement[] = [];
  for (const item of supplements) {
    if (isNull(item.rulebookId)) {
      const name = item.name.trim();
      const key = supplementNameKey(name);
      const saved = previous.some(
        (old) => isNull(old.rulebookId) && supplementNameKey(old.name) === key,
      );
      const error = manualSupplementError({ name, items: accepted, set: saved ? null : set });
      if (error) return { ok: false, error };
      accepted.push({ name, rulebookId: null });
      continue;
    }
    const rulebookId = item.rulebookId;
    if (accepted.some((done) => done.rulebookId === rulebookId)) continue;
    const kept = previous.some((old) => old.rulebookId === rulebookId);
    const option = options.find((candidate) => candidate.id === rulebookId);
    if (!option && !kept) {
      return { ok: false, error: "목록에 없는 서플리먼트가 있습니다. 다시 골라야 합니다." };
    }
    if (option && option.state !== SUPPLEMENT_OPTION_STATE.open && !kept) {
      return { ok: false, error: "인증하지 않은 서플리먼트가 있습니다. 다시 골라야 합니다." };
    }
    accepted.push({ name: option?.name ?? item.name.trim(), rulebookId });
  }
  return { ok: true, supplements: accepted };
}
