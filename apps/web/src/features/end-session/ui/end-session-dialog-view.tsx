import { ConfirmDialog, LineBreaks } from "@/shared/ui";

import { EndSessionDialogBody } from "./end-session-dialog-body";

const DESCRIPTION_LINES = ["마치면 참여자 관리가 닫히고", "출석 확인으로 넘어갑니다."];

interface EndSessionDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plannedEndAt: Date;
  pending: boolean;
  failed: boolean;
  onConfirm: () => void;
}

export function EndSessionDialogView({
  open,
  onOpenChange,
  plannedEndAt,
  pending,
  failed,
  onConfirm,
}: EndSessionDialogViewProps) {
  const confirmLabel = failed ? "다시 시도" : "마치기";

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="세션을 지금 마칠까요?"
      description={<LineBreaks lines={DESCRIPTION_LINES} />}
      confirmLabel={confirmLabel}
      confirmColorPalette="primary"
      pending={pending}
      onConfirm={onConfirm}
    >
      <EndSessionDialogBody plannedEndAt={plannedEndAt} failed={failed && !pending} />
    </ConfirmDialog>
  );
}
