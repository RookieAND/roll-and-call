"use client";

import { Button, Field, HStack, TextInput, VStack, toast } from "@roll-and-call/ui";
import { isUndefined, uniq } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import type { KindImpactPage, RulebookDetail, RulebookImpactCase } from "@/shared/server";
import { ActionNetworkError, Panel } from "@/shared/ui";

import { checkRulebookImpact } from "../api/check-rulebook-impact";
import { loadKindImpact } from "../api/load-kind-impact";
import { submitRulebookSave } from "../api/submit-rulebook-save";
import { submitRulebookUnhide } from "../api/submit-rulebook-unhide";
import { categoryHelp } from "../model/category-help";
import { draftCategory } from "../model/draft-category";
import { needsImpactCheck } from "../model/needs-impact-check";
import type { RulebookDraft } from "../model/rulebook-draft";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { FreeImpactDialog } from "./free-impact-dialog";
import { HideRulebookDialog } from "./hide-rulebook-dialog";
import { ImpactDialog } from "./impact-dialog";
import { KindCards } from "./kind-cards";
import { KindImpactDialog } from "./kind-impact-dialog";
import { SupersedesField } from "./supersedes-field";

interface RulebookEditFormProps {
  rulebook: RulebookDetail;
  viewerId: string;
  aside: ReactNode;
}

export function RulebookEditForm({ rulebook, viewerId, aside }: RulebookEditFormProps) {
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
  const [reason, setReason] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [impact, setImpact] = useState<RulebookImpactCase[]>([]);
  const [kindImpact, setKindImpact] = useState<KindImpactPage | null>(null);
  const [confirmingFree, setConfirmingFree] = useState(false);
  const [hiding, setHiding] = useState(false);

  const pending = checking || saving.pending || unhiding.pending;
  const category = draftCategory(draft, rulebook.allRulebooks, rulebook.id);
  const next = { ...draft, supersedesId: category.supersedesId };
  const dirty = (Object.keys(saved) as (keyof RulebookDraft)[]).some(
    (key) => saved[key] !== next[key],
  );
  const categories = uniq(rulebook.allRulebooks.map((row) => row.category));
  const certifiedCount = rulebook.certifiedGms.length;
  const kindDescription = `종류를 바꾸면 인증된 GM ${certifiedCount}명의 구인 자격도 함께 바뀝니다.`;
  const hasReason = Boolean(reason.trim());
  const canSave = dirty && hasReason && Boolean(draft.name.trim()) && !category.error && !pending;
  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const dialogOpen = impact.length > 0 || Boolean(kindImpact) || confirmingFree;
  const coreChanged = (saved.kind === "core") !== (next.kind === "core");
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
    const result = await saving.submit(rulebook.id, next, reason);
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

  return (
    <VStack data-full-bleed className="min-h-0 flex-1">
      <div className="mx-auto grid w-full max-w-page flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
        <VStack gap="200" className="min-w-0">
          {(saving.networkError && !dialogOpen) || unhiding.networkError ? (
            <ActionNetworkError />
          ) : null}
          <Panel title="기본 정보" bodyClassName="p-175">
            <BasicInfoFields
              draft={draft}
              categories={categories}
              idPrefix="rulebook"
              categoryHelp={draft.category === saved.category ? undefined : categoryHelp(category)}
              categoryError={category.error}
              nameError={nameError}
              disabled={pending}
              onChange={change}
            >
              <VStack gap="175" className="border-t border-(--rc-color-border-subtle) pt-175">
                <Field.Root
                  label="종류"
                  description={certifiedCount > 0 ? kindDescription : undefined}
                >
                  <KindCards
                    kind={draft.kind}
                    disabled={pending}
                    onChange={(kind) => change({ kind })}
                  />
                </Field.Root>
                <div className="max-w-[420px]">
                  <SupersedesField
                    draft={draft}
                    category={category}
                    idPrefix="rulebook"
                    disabled={pending}
                    onChange={(supersedesId) => change({ supersedesId })}
                  />
                </div>
              </VStack>
            </BasicInfoFields>
          </Panel>
          <Panel title="인증 정책" bodyClassName="p-175">
            <CertPolicyField
              certRequired={draft.certRequired}
              disabled={pending}
              onChange={(certRequired) => change({ certRequired })}
            />
          </Panel>
        </VStack>
        {aside}
      </div>
      <HStack
        align="end"
        gap="125"
        className="sticky bottom-0 border-t border-gray-200 bg-surface px-page py-150"
      >
        <Field.Root label="변경 사유" htmlFor="rulebook-reason" required className="flex-1">
          <TextInput
            id="rulebook-reason"
            value={reason}
            placeholder="기본 정보와 인증 정책을 함께 저장하며, 사유는 활동 기록에 남습니다"
            onChange={(event) => setReason(event.target.value)}
          />
        </Field.Root>
        {rulebook.hidden ? (
          <Button
            variant="outline"
            colorPalette="gray"
            disabled={!hasReason || pending}
            loading={unhiding.pending}
            onClick={() => void unhide()}
          >
            숨김 해제
          </Button>
        ) : (
          <Button
            variant="outline"
            colorPalette="danger"
            disabled={pending}
            onClick={() => setHiding(true)}
          >
            숨김 처리
          </Button>
        )}
        <Button
          loading={checking || (saving.pending && !dialogOpen)}
          disabled={!canSave}
          onClick={save}
          className="min-w-[96px]"
        >
          저장
        </Button>
      </HStack>
      <ImpactDialog
        rulebookLabel={rulebook.label}
        cases={impact}
        pending={saving.pending}
        networkError={saving.networkError}
        onConfirm={() => void persist()}
        onClose={() => setImpact([])}
      />
      <KindImpactDialog
        rulebookId={rulebook.id}
        rulebookLabel={rulebook.label}
        fromKind={saved.kind}
        toKind={next.kind}
        initial={kindImpact}
        pending={saving.pending}
        networkError={saving.networkError}
        onConfirm={() => void persist()}
        onClose={() => setKindImpact(null)}
      />
      <FreeImpactDialog
        open={confirmingFree}
        rulebookLabel={rulebook.label}
        certifiedCount={certifiedCount}
        pendingApplicationCount={rulebook.pendingApplicationCount}
        pending={saving.pending}
        networkError={saving.networkError}
        onConfirm={() => void persist()}
        onClose={() => setConfirmingFree(false)}
      />
      <HideRulebookDialog
        open={hiding}
        rulebookId={rulebook.id}
        rulebookLabel={rulebook.label}
        certifiedCount={certifiedCount}
        pendingApplicationCount={rulebook.pendingApplicationCount}
        viewerId={viewerId}
        onClose={() => setHiding(false)}
      />
    </VStack>
  );
}
