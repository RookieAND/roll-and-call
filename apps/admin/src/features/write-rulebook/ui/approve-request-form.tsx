"use client";

import { Button, Dialog, Field, Text, TextInput, VStack, cn, toast } from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import {
  RULEBOOK_KIND_DESCRIPTION,
  conflictTitle,
  formatDateTime,
  quoteWithParticle,
  withObjectParticle,
  withSubjectParticle,
} from "@/shared/lib";
import type { RulebookActionResult, RulebookRequestRow, RulebookRow } from "@/shared/server";
import { ConflictNotice, UserPreview } from "@/shared/ui";

import { submitRequestApproval } from "../api/submit-request-approval";
import { categoryHelp } from "../model/category-help";
import { draftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { KindSegmentField } from "./kind-segment-field";

type Conflict = Extract<RulebookActionResult, { ok: false }>["conflict"];

interface ApproveRequestFormProps {
  request: RulebookRequestRow;
  rulebooks: RulebookRow[];
  onDone: () => void;
}

// 요청자가 고른 카테고리·종류가 기본값이고, 모르겠다고 했으면 요청한 이름으로 새 카테고리에 기본 룰북을 만든다.
// 운영진은 카테고리·종류를 바꿔서 추가할 수 있다.
export function ApproveRequestForm({ request, rulebooks, onDone }: ApproveRequestFormProps) {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<RulebookDraft>({
    name: request.bookName,
    edition: request.edition,
    category: request.category ?? request.bookName,
    kind: request.kind ?? "core",
    supersedesId: null,
    aliasesText: "",
    certRequired: true,
  });
  const [reason, setReason] = useState("추가 요청 승인");
  const [duplicate, setDuplicate] = useState(false);
  const [conflict, setConflict] = useState<Conflict | undefined>(undefined);

  const categories = [...new Set(rulebooks.map((rulebook) => rulebook.category))];
  const category = draftCategory(draft, rulebooks);
  const conflicted = conflict !== undefined;
  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const help =
    !category.exists && category.name === request.bookName
      ? "요청한 이름으로 새 카테고리를 만듭니다."
      : categoryHelp(category);
  const canConfirm =
    Boolean(draft.name.trim() && reason.trim()) &&
    !category.error &&
    !nameError &&
    !pending &&
    !conflicted;
  const change = (changes: Partial<RulebookDraft>) => {
    setDraft({ ...draft, ...changes });
    setDuplicate(false);
  };
  const addedName = draft.name.trim() || request.name;

  const confirm = () =>
    startTransition(async () => {
      const result = await submitRequestApproval(request.id, draft, reason);
      if (result.ok) {
        toast.success(`「${addedName}」 룰북을 추가했습니다`);
        onDone();
      } else if ("duplicate" in result) setDuplicate(true);
      else setConflict(result.conflict);
    });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>새 룰북으로 추가</Dialog.Title>
        <Dialog.Description>
          {withSubjectParticle(request.requesterNickname)} 요청한{" "}
          {quoteWithParticle(request.name, withObjectParticle)} 룰북으로 등록합니다
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {conflicted ? (
            <ConflictNotice
              title={conflictTitle(conflict)}
              description={
                conflict
                  ? `${formatDateTime(conflict.at)}에 처리됐습니다. 입력한 내용은 저장되지 않았습니다.`
                  : "입력한 내용은 저장되지 않았습니다."
              }
              actions={<Dialog.Close render={<Button size="sm" />}>닫기</Dialog.Close>}
            />
          ) : null}
          <VStack gap="150" className={cn(conflicted && "pointer-events-none opacity-50")}>
            <BasicInfoFields
              draft={draft}
              categories={categories}
              idPrefix="approve-request"
              categoryHelp={help}
              categoryError={category.error}
              nameError={nameError}
              onChange={change}
            >
              <KindSegmentField
                kind={draft.kind}
                description={RULEBOOK_KIND_DESCRIPTION[draft.kind]}
                onChange={(kind) => change({ kind })}
              />
            </BasicInfoFields>
            <Field.Root label="인증 정책">
              <CertPolicyField
                certRequired={draft.certRequired}
                onChange={(certRequired) => change({ certRequired })}
              />
            </Field.Root>
            <Field.Root
              label="변경 사유"
              htmlFor="approve-request-reason"
              required
              description="요청 처리 기록과 함께 활동 기록에 남습니다."
            >
              <TextInput
                id="approve-request-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
            <UserPreview title="요청자에게 이렇게 보입니다">
              요청하신 {quoteWithParticle(addedName, withSubjectParticle)} 룰북으로 추가됐어요.
              인증을 받으면 이 룰북으로 구인을 열 수 있어요.
            </UserPreview>
          </VStack>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <Text typography="body4" foreground="hint" className="mr-auto">
          추가하면 요청은 처리됨으로 바뀌고, 요청자에게 알림이 전송됩니다
        </Text>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button loading={pending} disabled={!canConfirm} onClick={confirm}>
          추가
        </Button>
      </Dialog.Footer>
    </>
  );
}
