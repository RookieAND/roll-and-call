"use client";

import { Button, Field, TextInput, toast } from "@roll-and-call/ui";
import { useId, useState, useTransition, type ReactElement, type ReactNode } from "react";

import { quoteWithParticle, withObjectParticle } from "@/shared/lib";
import { ModalServerLabel, MODAL_FOOTER_CLASS, ResponsiveDialog } from "@/shared/ui";

import { saveSeller } from "../api/save-seller";

interface AddSellerDialogProps {
  // 데스크톱은 패널 머리의 작은 버튼, 모바일은 화면 아래 고정 버튼이 연다.
  trigger: ReactElement<Record<string, unknown>>;
  children: ReactNode;
}

export function AddSellerDialog({ trigger, children }: AddSellerDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const inputId = useId();

  const save = () =>
    startTransition(async () => {
      const result = await saveSeller(name);
      if (!result.ok) {
        if ("error" in result) toast.danger(result.error);
        else setDuplicate(true);
        return;
      }
      toast.success(`판매처 ${quoteWithParticle(name.trim(), withObjectParticle)} 추가했습니다`);
      setName("");
      setOpen(false);
    });

  return (
    <ResponsiveDialog.Root open={open} onOpenChange={(nextOpen) => pending || setOpen(nextOpen)}>
      <ResponsiveDialog.Trigger render={trigger}>{children}</ResponsiveDialog.Trigger>
      <ResponsiveDialog.Popup className="max-w-[480px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>전자책 판매처 추가</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            신청자가 전자책을 신청할 때 고르는 목록에 들어갑니다.
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Field.Root
            label="판매처 이름"
            htmlFor={inputId}
            required
            error={duplicate ? "이미 목록에 있는 판매처입니다" : undefined}
          >
            <TextInput
              id={inputId}
              maxLength={100}
              placeholder="예: 리디"
              enterKeyHint="done"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setDuplicate(false);
              }}
            />
          </Field.Root>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer
          layout="row"
          className={MODAL_FOOTER_CLASS}
          disabledReason={name.trim() ? undefined : "판매처 이름을 입력해야 추가할 수 있습니다"}
        >
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </ResponsiveDialog.Close>
          <Button loading={pending} disabled={!name.trim() || pending} onClick={save}>
            추가
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
