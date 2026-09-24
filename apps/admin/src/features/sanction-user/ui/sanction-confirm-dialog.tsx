import { AlertDialog, Button } from "@roll-and-call/ui";
import { useRef } from "react";

interface SanctionConfirmDialogProps {
  open: boolean;
  nickname: string;
  description: string;
  pending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function SanctionConfirmDialog({
  open,
  nickname,
  description,
  pending,
  onBack,
  onConfirm,
}: SanctionConfirmDialogProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || pending || onBack()}>
      <AlertDialog.Popup initialFocus={backRef} className="max-w-[480px]">
        <AlertDialog.Header>
          <AlertDialog.Title>{nickname} 제재를 확정할까요?</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <Button
            ref={backRef}
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            onClick={onBack}
          >
            뒤로
          </Button>
          <Button colorPalette="danger" loading={pending} disabled={pending} onClick={onConfirm}>
            제재 확정
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
