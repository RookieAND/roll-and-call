"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { Button, HStack } from "@trpg/ui";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  // 설명 아래에 붙는 부가 안내(목록 상자 등).
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  danger,
  pending,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  // 처리 중에는 닫히지 않는다. 결과를 모른 채 화면을 떠나지 않게.
  const handleOpenChange = (nextOpen: boolean) => {
    if (!pending) onOpenChange(nextOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-dim" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-700 border border-gray-200 bg-surface p-250 shadow-xl outline-none">
          <Dialog.Title className="text-base font-bold text-gray-900">{title}</Dialog.Title>
          {description && (
            <Dialog.Description className="mt-075 text-sm whitespace-pre-line text-gray-600">
              {description}
            </Dialog.Description>
          )}
          {children}
          <HStack gap="100" className="mt-250">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={danger ? "destructive" : "solid"}
              className="h-11 flex-1"
              loading={pending}
              disabled={pending}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </HStack>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
