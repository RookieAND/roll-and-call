import type { RulebookFields } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";

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
