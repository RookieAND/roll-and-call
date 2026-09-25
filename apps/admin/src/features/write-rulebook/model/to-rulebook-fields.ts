import type { RulebookFields } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";

// 앞뒤 공백을 걷고, 다른 이름은 쉼표로 나눠 빈 칸과 중복을 뺀다. 카테고리를 비우면 단권으로 보고 룰북 이름을 쓴다.
export function toRulebookFields(draft: RulebookDraft): RulebookFields {
  const aliases = draft.aliasesText
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);
  const name = draft.name.trim();
  return {
    name,
    edition: draft.edition.trim(),
    category: draft.category.trim() || name,
    kind: draft.kind,
    supersedesId: draft.kind === "core" ? draft.supersedesId : null,
    aliases: [...new Set(aliases)],
    certRequired: draft.certRequired,
  };
}
