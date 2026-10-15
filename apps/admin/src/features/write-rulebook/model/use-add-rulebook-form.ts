"use client";

import { toast } from "@roll-and-call/ui";
import { isUndefined, uniq } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { RulebookRequestRow, RulebookRow } from "@/entities/rulebook/server";
import { conflictToastText, useActionSubmit } from "@/shared/lib";
import { useServerPath } from "@/shared/ui";

import { submitRulebookNew } from "../api/submit-rulebook-new";
import { categoryHelp } from "./category-help";
import { draftCategory } from "./draft-category";
import type { RulebookDraft } from "./rulebook-draft";

interface UseAddRulebookFormOptions {
  rulebooks: RulebookRow[];
  request: RulebookRequestRow | null;
  initialCategory: string;
  viewerId: string;
}

// 데스크톱 폼과 모바일 폼이 같은 초안·검증·추가 흐름을 쓴다.
export function useAddRulebookForm({
  rulebooks,
  request,
  initialCategory,
  viewerId,
}: UseAddRulebookFormOptions) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(submitRulebookNew);
  const [draft, setDraft] = useState<RulebookDraft>({
    name: request?.bookName ?? "",
    edition: request?.edition ?? "",
    category: request ? (request.category ?? request.bookName) : initialCategory,
    categoryAlias: "",
    kind: request?.kind ?? "core",
    supersedesId: null,
    aliasesText: "",
    certRequired: true,
  });
  const [miniRule, setMiniRule] = useState(false);
  const [reason, setReason] = useState(request ? "추가 요청 승인" : "");
  const [duplicate, setDuplicate] = useState(false);

  const backHref = request ? "/rules?tab=requests" : "/rules";
  const categories = uniq(rulebooks.map((rulebook) => rulebook.category));
  const category = draftCategory(draft, rulebooks);
  const help =
    request && !category.exists && category.name === request.bookName
      ? "요청한 이름으로 새 카테고리를 만듭니다."
      : categoryHelp(category);
  const existingCategory = rulebooks.find((rulebook) => rulebook.category === category.name);
  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const canAdd =
    Boolean(draft.name.trim() && reason.trim()) && !category.error && !nameError && !pending;
  const footerNote = request
    ? "추가하면 요청은 처리됨으로 바뀌고, 처리 내역은 활동 기록에 남습니다."
    : "추가한 내용과 사유는 활동 기록에 남습니다.";
  const change = (changes: Partial<RulebookDraft>) => {
    setDraft({ ...draft, ...changes });
    setDuplicate(false);
  };

  const add = async () => {
    const result = await submit({
      requestId: request?.id ?? null,
      draft: { ...draft, supersedesId: category.supersedesId },
      miniRule,
      reason,
    });
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(`「${draft.name.trim()}」 룰북을 추가했습니다`);
      router.push(toServerPath(backHref));
      return;
    }
    if ("duplicate" in result) {
      setDuplicate(true);
      return;
    }
    const conflict = result.conflict;
    toast.info(conflictToastText({ conflict, self: conflict?.byId === viewerId, target: "요청" }));
    router.push(toServerPath(backHref));
  };

  return {
    draft,
    change,
    miniRule,
    setMiniRule,
    reason,
    setReason,
    backHref,
    categories,
    category,
    help,
    existingCategory,
    nameError,
    canAdd,
    footerNote,
    pending,
    networkError,
    add,
  };
}
