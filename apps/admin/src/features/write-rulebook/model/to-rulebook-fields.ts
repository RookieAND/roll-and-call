import type { RulebookFields } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";

// 앞뒤 공백을 걷고, 다른 이름은 쉼표로 나눠 빈 칸과 중복을 뺀다.
export function toRulebookFields(draft: RulebookDraft): RulebookFields {
  const aliases = draft.aliasesText
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);
  return {
    name: draft.name.trim(),
    edition: draft.edition.trim(),
    aliases: [...new Set(aliases)],
    certRequired: draft.certRequired,
  };
}
