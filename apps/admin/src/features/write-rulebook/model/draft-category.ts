import { RULEBOOK_KIND_LABEL, withTopicParticle } from "@/shared/lib";
import type { RulebookRow } from "@/shared/server";

import type { RulebookDraft } from "./rulebook-draft";

type RulebookOption = Pick<RulebookRow, "id" | "label" | "category" | "kind">;

// 카테고리 칸이 비면 기본 룰북은 룰북 이름을 쓴다. 서플리먼트·핸드북은 기존 카테고리에만 넣는다.
// 대신하는 구판은 같은 카테고리의 다른 기본 룰북 가운데에서만 고르고, 후보에서 빠진 값은 버린다.
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
