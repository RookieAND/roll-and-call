import { compact, uniq } from "es-toolkit";

import type { RulebookFields } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";
import { toCategoryAlias } from "./to-category-alias";

export function toRulebookFields(draft: RulebookDraft): RulebookFields {
  const aliases = compact(draft.aliasesText.split(",").map((alias) => alias.trim()));
  const name = draft.name.trim();
  return {
    name,
    edition: draft.edition.trim(),
    category: draft.category.trim() || name,
    categoryAlias: draft.kind === "core" ? toCategoryAlias(draft.categoryAlias) : null,
    kind: draft.kind,
    supersedesId: draft.kind === "core" ? draft.supersedesId : null,
    aliases: uniq(aliases),
    certRequired: draft.certRequired,
  };
}
