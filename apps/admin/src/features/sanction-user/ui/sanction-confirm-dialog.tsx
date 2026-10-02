import { AlertDialog, Button } from "@roll-and-call/ui";
import { useRef } from "react";

import { FactBox, FactSub, ModalServerLabel } from "@/shared/ui";

interface SanctionConfirmDialogProps {
  open: boolean;
  nickname: string;
  days: number | null;
  end: string | null;
  userReason: string;
  closedCount: number;
  closedMemberCount: number;
  pending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function SanctionConfirmDialog({
  open,
  nickname,
  days,
  end,
  userReason,
  closedCount,
  closedMemberCount,
  pending,
  onBack,
  onConfirm,
}: SanctionConfirmDialogProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  const period = days ? `${days}일` : "무기한";
  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || pending || onBack()}>
      <AlertDialog.Popup initialFocus={backRef} className="max-w-[480px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>{nickname} 제재를 확정할까요?</AlertDialog.Title>
          <AlertDialog.Description>
            확정한 제재는 되돌릴 수 없으며, 해제는 따로 진행합니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <FactBox
            items={[
              {
                label: "제재 기간",
                value: (
                  <>
                    {period}
                    {end ? <FactSub>{`${end}까지`}</FactSub> : null}
                  </>
                ),
              },
              { label: "사유", value: userReason },
              {
                label: "닫는 구인",
                value: (
                  <>
                    {`${closedCount}건`}
                    {closedCount ? (
                      <FactSub>{`참여자 ${closedMemberCount}명에게 알림`}</FactSub>
                    ) : null}
                  </>
                ),
              },
            ]}
          />
        </AlertDialog.Body>
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
