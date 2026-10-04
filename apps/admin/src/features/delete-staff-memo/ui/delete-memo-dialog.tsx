"use client";

import { AlertDialog, Button, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import { ActionNetworkError, ModalServerLabel } from "@/shared/ui";

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
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup className="max-w-[480px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>메모를 지울까요?</AlertDialog.Title>
          <AlertDialog.Description>지운 메모는 되돌릴 수 없습니다.</AlertDialog.Description>
        </AlertDialog.Header>
        {networkError ? (
          <AlertDialog.Body className="mt-200">
            <ActionNetworkError />
          </AlertDialog.Body>
        ) : null}
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button colorPalette="danger" loading={pending} onClick={() => void remove()}>
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "지우기"}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
