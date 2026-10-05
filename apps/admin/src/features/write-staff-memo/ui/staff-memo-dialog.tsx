"use client";

import { Button, Dialog, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isString, isUndefined } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import { ActionNetworkError, ModalServerLabel, RetryableLabel } from "@/shared/ui";

import { submitStaffMemo } from "../api/submit-staff-memo";

interface StaffMemoDialogProps {
  userId: string;
  nickname: string;
  // 있으면 고치기 창이다.
  memo?: { id: string; body: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffMemoDialog({
  userId,
  nickname,
  memo,
  open,
  onOpenChange,
}: StaffMemoDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(submitStaffMemo);
  const [body, setBody] = useState(memo?.body ?? "");
  const editing = !isUndefined(memo);
  const canSave = Boolean(body.trim()) && body.trim() !== memo?.body && !pending;
  const title = editing ? "운영진 메모 고치기" : `${nickname} 운영진 메모`;
  const saveLabel = editing ? "저장" : "메모 저장";

  const save = async () => {
    const result = await submit({ userId, memo, body });
    if (isUndefined(result)) return;
    if ("error" in result && isString(result.error)) {
      toast.danger(result.error);
      return;
    }
    if (result.ok) toast.success(editing ? "메모를 고쳤습니다" : "메모를 남겼습니다");
    else toast.info(conflictToastText({ conflict: null, self: false, target: "메모" }));
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[560px]">
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>운영진 메모는 사용자에게 보이지 않습니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <Textarea
              aria-label="운영진 메모"
              rows={4}
              placeholder="판단한 근거나 확인한 내용을 적어 주세요"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canSave} onClick={() => void save()}>
            <RetryableLabel failed={networkError}>{saveLabel}</RetryableLabel>
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
