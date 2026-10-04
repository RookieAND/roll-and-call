import { AlertDialog, Button, Callout, VStack } from "@roll-and-call/ui";
import { useRef } from "react";

import { withTopicParticle } from "@/shared/lib";
import { FactBox, FactSub, ModalServerLabel } from "@/shared/ui";

interface RevokeConfirmDialogProps {
  open: boolean;
  nickname: string;
  rulebooks: string[];
  userReason: string;
  closedCount: number;
  pending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function RevokeConfirmDialog({
  open,
  nickname,
  rulebooks,
  userReason,
  closedCount,
  pending,
  onBack,
  onConfirm,
}: RevokeConfirmDialogProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  const rulebookNames = rulebooks.join(", ");
  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || pending || onBack()}>
      <AlertDialog.Popup initialFocus={backRef} className="max-w-[560px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>{rulebookNames} 인증을 반려로 돌릴까요?</AlertDialog.Title>
          <AlertDialog.Description>
            {`다시 신청해 승인받기 전까지 ${withTopicParticle(nickname)} 이 룰북으로 구인을 열 수 없습니다.`}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            <FactBox
              items={[
                { label: "반려로 돌릴 룰북", value: rulebookNames },
                { label: "사유", value: userReason },
                {
                  label: "취소하는 구인",
                  value: (
                    <>
                      {`${closedCount}건`}
                      {closedCount ? <FactSub>참여자에게 알림</FactSub> : null}
                    </>
                  ),
                },
              ]}
            />
            <Callout.Root colorPalette="warning">
              <Callout.Icon />
              <Callout.Description>
                반려로 돌리면 이 인증에 쓰인 증빙 이미지가 즉시 삭제됩니다.
              </Callout.Description>
            </Callout.Root>
          </VStack>
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
            반려로 돌리기
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
