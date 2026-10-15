"use client";

import { Button, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { useRouter } from "next/navigation";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import {
  ActionNetworkError,
  ModalServerLabel,
  RetryableLabel,
  MODAL_FOOTER_CLASS,
  ResponsiveDialog,
} from "@/shared/ui";

import { removeStaffMemo } from "../api/remove-staff-memo";

interface DeleteMemoDialogProps {
  memoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteMemoDialog({ memoId, open, onOpenChange }: DeleteMemoDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(removeStaffMemo);

  const remove = async () => {
    const result = await submit({ memoId });
    if (isUndefined(result)) return;
    if (result.ok) toast.success("메모를 지웠습니다");
    else toast.info(conflictToastText({ conflict: null, self: false, target: "메모" }));
    onOpenChange(false);
    router.refresh();
  };

  return (
    <ResponsiveDialog.Root
      alert
      open={open}
      onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}
    >
      <ResponsiveDialog.Popup className="max-w-[480px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>메모를 지울까요?</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            지운 메모는 되돌릴 수 없습니다.
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        {networkError ? (
          <ResponsiveDialog.Body>
            <ActionNetworkError />
          </ResponsiveDialog.Body>
        ) : null}
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </ResponsiveDialog.Close>
          <Button colorPalette="danger" loading={pending} onClick={() => void remove()}>
            <RetryableLabel failed={networkError}>{"지우기"}</RetryableLabel>
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
