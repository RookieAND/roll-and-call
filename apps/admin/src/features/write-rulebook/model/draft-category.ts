import { RULEBOOK_KIND_LABEL, withTopicParticle } from "@/shared/lib";
import type { RulebookRow } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";

type RulebookOption = Pick<RulebookRow, "id" | "label" | "category" | "kind">;

export function draftCategory(draft: RulebookDraft, rulebooks: RulebookOption[], selfId?: string) {
  const core = draft.kind === "core";
  const typed = draft.category.trim();
  const name = typed || (core ? draft.name.trim() : "");
  const books = rulebooks.filter((rulebook) => rulebook.category === name);
  const exists = books.length > 0;
  const error =
    !core && !exists
      ? `${withTopicParticle(RULEBOOK_KIND_LABEL[draft.kind])} 기존 카테고리를 골라야 합니다.`
      : undefined;
  const supersedesOptions = core
    ? books.filter((rulebook) => rulebook.kind === "core" && rulebook.id !== selfId)
    : [];
  const supersedesId = supersedesOptions.some((option) => option.id === draft.supersedesId)
    ? draft.supersedesId
    : null;
  return {
    name,
    typed: Boolean(typed),
    exists,
    bookCount: books.length,
    error,
    supersedesOptions,
    supersedesId,
  };
}

export type DraftCategory = ReturnType<typeof draftCategory>;
