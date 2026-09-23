"use client";

import { AlertDialog, Button } from "@roll-and-call/ui";
import { useRef, type ReactNode } from "react";

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
  const cancelRef = useRef<HTMLButtonElement>(null);

  // 처리 중에는 닫히지 않는다. 결과를 모른 채 화면을 떠나지 않게.
  const handleOpenChange = (nextOpen: boolean) => {
    if (!pending) onOpenChange(nextOpen);
  };

  const confirmPalette = danger ? "danger" : "primary";

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Popup initialFocus={danger ? cancelRef : undefined}>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          {description && <AlertDialog.Description>{description}</AlertDialog.Description>}
        </AlertDialog.Header>
        {children}
        <AlertDialog.Footer layout="row">
          <Button
            ref={cancelRef}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            colorPalette={confirmPalette}
            size="lg"
            className="flex-1"
            loading={pending}
            disabled={pending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
