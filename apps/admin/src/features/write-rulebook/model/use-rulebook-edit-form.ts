"use client";

import { toast } from "@roll-and-call/ui";
import { isUndefined, uniq } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type {
  KindImpactPage,
  RulebookDetail,
  RulebookImpactCase,
} from "@/entities/rulebook/server";
import { conflictToastText, useActionSubmit } from "@/shared/lib";

import { checkRulebookImpact } from "../api/check-rulebook-impact";
import { loadKindImpact } from "../api/load-kind-impact";
import { submitRulebookSave } from "../api/submit-rulebook-save";
import { submitRulebookUnhide } from "../api/submit-rulebook-unhide";
import { categoryHelp } from "./category-help";
import { draftCategory } from "./draft-category";
import { needsImpactCheck } from "./needs-impact-check";
import type { RulebookDraft } from "./rulebook-draft";

interface UseRulebookEditFormOptions {
  rulebook: RulebookDetail;
  viewerId: string;
}

// 데스크톱 폼과 모바일 폼이 같은 초안·검증·저장 흐름을 쓴다.
export function useRulebookEditForm({ rulebook, viewerId }: UseRulebookEditFormOptions) {
  const router = useRouter();
  const [checking, startChecking] = useTransition();
  const saving = useActionSubmit(submitRulebookSave);
  const unhiding = useActionSubmit(submitRulebookUnhide);
  const saved: RulebookDraft = {
    name: rulebook.name,
    edition: rulebook.edition,
    category: rulebook.category,
    categoryAlias: rulebook.categoryAlias ?? "",
    kind: rulebook.kind,
    supersedesId: rulebook.supersedesId,
    aliasesText: rulebook.aliases.join(", "),
    certRequired: rulebook.certRequired,
  };
  const [draft, setDraft] = useState(saved);
  const [miniRule, setMiniRule] = useState(rulebook.categoryMiniRule);
  const [reason, setReason] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [impact, setImpact] = useState<RulebookImpactCase[]>([]);
  const [kindImpact, setKindImpact] = useState<KindImpactPage | null>(null);
  const [confirmingFree, setConfirmingFree] = useState(false);
  const [hiding, setHiding] = useState(false);

  const pending = checking || saving.pending || unhiding.pending;
  const category = draftCategory(draft, rulebook.allRulebooks, rulebook.id);
  const next = { ...draft, supersedesId: category.supersedesId };
  // 분류를 바꾼 초안이면 그 분류의 값을 따르므로 미니룰은 바꾸지 않는다.
  const miniRuleEditable = draft.category === saved.category;
  const miniRuleDirty = miniRuleEditable && miniRule !== rulebook.categoryMiniRule;
  const dirty =
    miniRuleDirty ||
    (Object.keys(saved) as (keyof RulebookDraft)[]).some((key) => saved[key] !== next[key]);
  const categories = uniq(rulebook.allRulebooks.map((row) => row.category));
  const certifiedCount = rulebook.certifiedGms.length;
  const kindDescription = `종류를 바꾸면 인증된 GM ${certifiedCount}명의 구인 자격도 함께 바뀝니다.`;
  const hasReason = Boolean(reason.trim());
  const canSave = dirty && hasReason && Boolean(draft.name.trim()) && !category.error && !pending;
  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const dialogOpen = impact.length > 0 || Boolean(kindImpact) || confirmingFree;
  const coreChanged = (saved.kind === "core") !== (next.kind === "core");
  const categoryHint = draft.category === saved.category ? undefined : categoryHelp(category);
  const change = (changes: Partial<RulebookDraft>) => {
    setDraft({ ...draft, ...changes });
    setDuplicate(false);
  };
  const closeDialogs = () => {
    setImpact([]);
    setKindImpact(null);
    setConfirmingFree(false);
  };

  const persist = async () => {
    const result = await saving.submit(
      rulebook.id,
      next,
      reason,
      miniRuleEditable ? miniRule : undefined,
    );
    if (isUndefined(result)) return;
    closeDialogs();
    if (!result.ok) {
      setDuplicate(true);
      return;
    }
    toast.success(`「${draft.name.trim()}」 룰북을 저장했습니다`);
    setReason("");
  };

  // 종류(기본 룰북 ↔ 다른 종류)를 바꾸면 종류 변경 창, 구판 연결 해제·인증 필요로 바꾸면 영향 창, 인증 불필요로 바꾸면 그 창을 띄운다.
  // ponytail: 여러 변경이 한꺼번에면 앞의 창 하나만 띄운다. 따로 확인해야 하면 창을 차례로 잇는다.
  const save = () =>
    startChecking(async () => {
      if (coreChanged) {
        setKindImpact(
          await loadKindImpact({
            rulebookId: rulebook.id,
            nextKind: next.kind,
            query: "",
            cursor: null,
          }),
        );
        return;
      }
      const cases = needsImpactCheck({ saved, next })
        ? await checkRulebookImpact({ id: rulebook.id, draft: next })
        : [];
      if (cases.length > 0) {
        setImpact(cases);
        return;
      }
      if (saved.certRequired && !next.certRequired) {
        setConfirmingFree(true);
        return;
      }
      await persist();
    });

  const unhide = async () => {
    const result = await unhiding.submit(rulebook.id, reason);
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(`「${rulebook.label}」 룰북을 다시 보이게 했습니다`);
      setReason("");
      return;
    }
    const { conflict } = result;
    toast.info(conflictToastText({ conflict, self: conflict?.byId === viewerId, target: "룰북" }));
    router.refresh();
  };

  return {
    saved,
    draft,
    next,
    change,
    miniRule,
    setMiniRule,
    miniRuleEditable,
    reason,
    setReason,
    category,
    categories,
    categoryHint,
    certifiedCount,
    kindDescription,
    hasReason,
    canSave,
    nameError,
    pending,
    checking,
    saving,
    unhiding,
    dialogOpen,
    impact,
    setImpact,
    kindImpact,
    setKindImpact,
    confirmingFree,
    setConfirmingFree,
    hiding,
    setHiding,
    persist,
    save,
    unhide,
  };
}

export type RulebookEditFormState = ReturnType<typeof useRulebookEditForm>;
