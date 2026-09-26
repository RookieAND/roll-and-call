"use client";

import { Button, Field, HStack, TextInput, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";
import type { RulebookActionResult, RulebookDetail } from "@/shared/server";
import { ConflictNotice, Panel } from "@/shared/ui";

import { submitRulebookHide } from "../api/submit-rulebook-hide";
import { submitRulebookSave } from "../api/submit-rulebook-save";
import { categoryHelp } from "../model/category-help";
import { draftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { KindCards } from "./kind-cards";
import { SupersedesField } from "./supersedes-field";

type Conflict = Extract<RulebookActionResult, { ok: false }>["conflict"];

interface RulebookEditFormProps {
  rulebook: RulebookDetail;
  aside: ReactNode;
}

// 기본 정보와 인증 정책을 한 번에 저장한다. 변경 사유는 하단 한 칸이 저장과 숨김 모두에 쓰인다.
export function RulebookEditForm({ rulebook, aside }: RulebookEditFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const saved: RulebookDraft = {
    name: rulebook.name,
    edition: rulebook.edition,
    category: rulebook.category,
    kind: rulebook.kind,
    supersedesId: rulebook.supersedesId,
    aliasesText: rulebook.aliases.join(", "),
    certRequired: rulebook.certRequired,
  };
  const [draft, setDraft] = useState(saved);
  const [reason, setReason] = useState("");
  const [conflict, setConflict] = useState<Conflict | undefined>(undefined);

  const category = draftCategory(draft, rulebook.allRulebooks, rulebook.id);
  const next = { ...draft, supersedesId: category.supersedesId };
  const dirty = (Object.keys(saved) as (keyof RulebookDraft)[]).some(
    (key) => saved[key] !== next[key],
  );
  const categories = [...new Set(rulebook.allRulebooks.map((row) => row.category))];
  const certifiedCount = rulebook.certifiedGms.length;
  const kindDescription = `종류를 바꾸면 인증된 GM ${certifiedCount}명의 구인 자격도 함께 바뀝니다.`;
  const hasReason = Boolean(reason.trim());
  const canSave = dirty && hasReason && Boolean(draft.name.trim()) && !category.error && !pending;
  const canHide = hasReason && !pending && !rulebook.hidden;
  const conflictTitle = conflict
    ? `다른 운영진(${conflict.by})이 먼저 숨김 처리했습니다`
    : "이미 숨긴 룰북입니다";
  const conflictDescription = conflict
    ? `${formatDateTime(conflict.at)}에 처리됐습니다. 입력한 사유는 저장되지 않았습니다.`
    : "입력한 사유는 저장되지 않았습니다.";
  const change = (changes: Partial<RulebookDraft>) => setDraft({ ...draft, ...changes });

  const save = () =>
    startTransition(async () => {
      await submitRulebookSave(rulebook.id, next, reason);
      toast.success(`「${draft.name.trim()}」 룰북을 저장했습니다`);
      setReason("");
    });

  const hide = () =>
    startTransition(async () => {
      const result = await submitRulebookHide(rulebook.id, reason);
      if (!result.ok) {
        setConflict(result.conflict);
        router.refresh();
        return;
      }
      toast.success(`「${rulebook.label}」 룰북을 숨겼습니다`);
      setReason("");
    });

  return (
    <VStack data-full-bleed className="min-h-0 flex-1">
      <div className="mx-auto grid w-full max-w-page flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-150 p-200">
        <VStack gap="150" className="min-w-0">
          {conflict !== undefined ? (
            <ConflictNotice
              title={conflictTitle}
              description={conflictDescription}
              actions={
                <Button size="sm" onClick={() => setConflict(undefined)}>
                  확인
                </Button>
              }
            />
          ) : null}
          <Panel title="기본 정보" bodyClassName="p-175">
            <BasicInfoFields
              draft={draft}
              categories={categories}
              idPrefix="rulebook"
              categoryHelp={draft.category === saved.category ? undefined : categoryHelp(category)}
              categoryError={category.error}
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
        {rulebook.hidden ? null : (
          <Button variant="outline" colorPalette="gray" disabled={!canHide} onClick={hide}>
            숨김 처리
          </Button>
        )}
        <Button loading={pending} disabled={!canSave} onClick={save} className="min-w-[96px]">
          저장
        </Button>
      </HStack>
    </VStack>
  );
}
