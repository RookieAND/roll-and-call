"use client";

import { ConfirmDialog, LineBreaks, toast, toastActionError, useAction } from "@/shared/ui";

import { finishEarly } from "../api/finish-early";

const LINES = [
  "지금까지 함께한 참여자는 모두 완주로 인정됩니다.",
  "남은 회차는 열리지 않습니다.",
  "이 작업은 되돌릴 수 없습니다.",
];

interface FinishEarlyDialogProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinishEarlyDialog({ gameId, open, onOpenChange }: FinishEarlyDialogProps) {
  const { pending, run } = useAction();

  function confirm() {
    run(() => finishEarly(gameId), {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("구인을 마쳤습니다.");
      },
      onError: (result) => {
        onOpenChange(false);
        toastActionError(result);
      },
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="여기서 마치시겠습니까"
      description={<LineBreaks lines={LINES} />}
      confirmLabel="여기서 마치기"
      confirmColorPalette="danger"
      pending={pending}
      onConfirm={confirm}
    />
  );
}
