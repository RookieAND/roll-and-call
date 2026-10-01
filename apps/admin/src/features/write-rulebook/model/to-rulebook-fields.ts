import { compact, uniq } from "es-toolkit";

import type { RulebookFields } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";

export function toRulebookFields(draft: RulebookDraft): RulebookFields {
  const aliases = compact(draft.aliasesText.split(",").map((alias) => alias.trim()));
  const name = draft.name.trim();
  return {
    name,
    edition: draft.edition.trim(),
    category: draft.category.trim() || name,
    kind: draft.kind,
    supersedesId: draft.kind === "core" ? draft.supersedesId : null,
    aliases: uniq(aliases),
    certRequired: draft.certRequired,
  };
}
