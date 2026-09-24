"use client";

import { Button, Dialog, Field, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import { submitRulebookAdd } from "../api/submit-rulebook-add";
import type { RulebookDraft } from "../model/rulebook-draft";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";

const EMPTY_DRAFT: RulebookDraft = { name: "", edition: "", aliasesText: "", certRequired: true };

interface AddRulebookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRulebookDialog({ open, onOpenChange }: AddRulebookDialogProps) {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [reason, setReason] = useState("");
  const [duplicate, setDuplicate] = useState(false);

  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const change = (changes: Partial<RulebookDraft>) => {
    setDraft({ ...draft, ...changes });
    setDuplicate(false);
  };
  const canAdd = Boolean(draft.name.trim() && reason.trim()) && !nameError && !pending;

  const add = () =>
    startTransition(async () => {
      const result = await submitRulebookAdd(draft, reason);
      if (!result.ok) {
        setDuplicate(true);
        return;
      }
      toast.success(`「${draft.name.trim()}」 룰북을 추가했습니다`);
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup size="lg" className="max-w-[560px]">
        <Dialog.Header>
          <Dialog.Title>룰북 추가</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            <BasicInfoFields
              draft={draft}
              idPrefix="add-rulebook"
              nameError={nameError}
              onChange={change}
            />
            <VStack gap="075">
              <Text typography="body4" weight="bold" id="add-rulebook-cert-label">
                인증
              </Text>
              <CertPolicyField
                certRequired={draft.certRequired}
                labelledBy="add-rulebook-cert-label"
                onChange={(certRequired) => change({ certRequired })}
              />
            </VStack>
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
        <Dialog.Footer layout="row" className="items-center justify-end">
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
