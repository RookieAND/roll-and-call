"use client";

import { Button, Dialog, Field, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";

import type { RulebookRow } from "@/shared/server";
import { FormSection } from "@/shared/ui";

import { submitRulebookAdd } from "../api/submit-rulebook-add";
import { categoryHelp } from "../model/category-help";
import { draftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { KindCards } from "./kind-cards";
import { SupersedesField } from "./supersedes-field";

interface AddRulebookDialogProps {
  open: boolean;
  rulebooks: RulebookRow[];
  initialCategory?: string;
  onOpenChange: (open: boolean) => void;
}

export function AddRulebookDialog({
  open,
  rulebooks,
  initialCategory = "",
  onOpenChange,
}: AddRulebookDialogProps) {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<RulebookDraft>({
    name: "",
    edition: "",
    category: initialCategory,
    kind: "core",
    supersedesId: null,
    aliasesText: "",
    certRequired: true,
  });
  const [reason, setReason] = useState("");
  const [duplicate, setDuplicate] = useState(false);

  const categories = [...new Set(rulebooks.map((rulebook) => rulebook.category))];
  const category = draftCategory(draft, rulebooks);
  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const change = (changes: Partial<RulebookDraft>) => {
    setDraft({ ...draft, ...changes });
    setDuplicate(false);
  };
  const canAdd =
    Boolean(draft.name.trim() && reason.trim()) && !category.error && !nameError && !pending;

  const add = () =>
    startTransition(async () => {
      const result = await submitRulebookAdd(
        { ...draft, supersedesId: category.supersedesId },
        reason,
      );
      if (!result.ok) {
        setDuplicate(true);
        return;
      }
      toast.success(`「${draft.name.trim()}」 룰북을 추가했습니다`);
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup size="lg" className="max-w-[720px]">
        <Dialog.Header>
          <Dialog.Title>룰북 추가</Dialog.Title>
          <Dialog.Description>
            책 한 권을 등록합니다. 같은 TRPG의 책은 한 카테고리로 묶습니다.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="250">
            <FormSection title="1. 책 정보">
              <BasicInfoFields
                draft={draft}
                categories={categories}
                idPrefix="add-rulebook"
                categoryHelp={categoryHelp(category)}
                categoryError={category.error}
                nameError={nameError}
                onChange={change}
              />
            </FormSection>
            <FormSection
              title="2. 종류"
              description="종류에 따라 GM 자격과 인증 신청 조건이 정해집니다."
            >
              <KindCards kind={draft.kind} onChange={(kind) => change({ kind })} />
              <SupersedesField
                draft={draft}
                category={category}
                idPrefix="add-rulebook"
                onChange={(supersedesId) => change({ supersedesId })}
              />
            </FormSection>
            <FormSection title="3. 인증 정책">
              <CertPolicyField
                certRequired={draft.certRequired}
                onChange={(certRequired) => change({ certRequired })}
              />
            </FormSection>
            <Field.Root label="변경 사유" htmlFor="add-rulebook-reason" required>
              <Textarea
                id="add-rulebook-reason"
                rows={2}
                placeholder="입력한 사유는 활동 기록에 남습니다"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center">
          {category.error ? (
            <Text
              typography="body4"
              foreground="hint"
              className="mr-auto inline-flex items-center gap-075"
            >
              <TriangleAlert size={14} aria-hidden />
              카테고리를 골라야 추가할 수 있습니다
            </Text>
          ) : (
            <Text typography="body4" foreground="hint" className="mr-auto">
              추가한 내용과 사유는 활동 기록에 남습니다
            </Text>
          )}
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canAdd} onClick={add}>
            추가
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
