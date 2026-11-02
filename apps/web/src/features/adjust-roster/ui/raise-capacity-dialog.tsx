"use client";

import { Card, Text } from "@roll-and-call/ui";

import { ConfirmDialog, LARGE_DIALOG_TITLE_CLASS } from "@/shared/ui";

interface RaiseCapacityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxPlayers: number;
  pending: boolean;
  onConfirm: () => void;
}

export function RaiseCapacityDialog({
  open,
  onOpenChange,
  maxPlayers,
  pending,
  onConfirm,
}: RaiseCapacityDialogProps) {
  return (
    <ConfirmDialog
      titleClassName={LARGE_DIALOG_TITLE_CLASS}
      open={open}
      onOpenChange={onOpenChange}
      title="정원을 1명 늘릴까요?"
      description="세션이 시작된 뒤에는 한 번만 늘릴 수 있습니다."
      confirmLabel="늘리고 추가"
      pending={pending}
      onConfirm={onConfirm}
    >
      <Card.Root padding="sm" radius={400} background="none" className="bg-gray-100">
        <Text numeric typography="subtitle1">
          정원 {maxPlayers}명 → {maxPlayers + 1}명
        </Text>
      </Card.Root>
    </ConfirmDialog>
  );
}
