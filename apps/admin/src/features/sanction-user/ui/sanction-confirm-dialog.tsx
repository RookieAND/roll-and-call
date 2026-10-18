import { Button, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRef } from "react";

import { formatFullDateTime } from "@/shared/lib";
import {
  ActionNetworkError,
  FactBox,
  FactSub,
  ModalServerLabel,
  MODAL_FOOTER_CLASS,
  ResponsiveDialog,
} from "@/shared/ui";

const BLOCKED_TEXT = "참가 신청·구인 개설·룰북 인증 신청을 막습니다.";

interface SanctionConfirmDialogProps {
  open: boolean;
  nickname: string;
  days: number | null;
  end: Date | null;
  userReason: string;
  cancelCount: number;
  notifiedCount: number;
  staffChannel: boolean;
  pending: boolean;
  networkError: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function SanctionConfirmDialog({
  open,
  nickname,
  days,
  end,
  userReason,
  cancelCount,
  notifiedCount,
  staffChannel,
  pending,
  networkError,
  onBack,
  onConfirm,
}: SanctionConfirmDialogProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  const period = isNull(days) ? "무기한" : `${days}일`;
  const blocked =
    isNull(days) || isNull(end)
      ? `해제하기 전까지 ${BLOCKED_TEXT}`
      : `${days}일 동안, ${formatFullDateTime(end)}까지 ${BLOCKED_TEXT}`;
  return (
    <ResponsiveDialog.Root
      alert
      open={open}
      onOpenChange={(nextOpen) => nextOpen || pending || onBack()}
    >
      <ResponsiveDialog.Popup initialFocus={backRef} className="max-w-[480px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>{nickname} 제재를 확정할까요?</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            {blocked}
            {cancelCount > 0 ? (
              <>
                <br />
                {`구인 ${cancelCount}건이 취소되고 확정자·대기자 ${notifiedCount}명에게 알림 탭으로 알립니다.`}
              </>
            ) : null}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <VStack gap="125">
            {networkError ? <ActionNetworkError /> : null}
            <FactBox
              items={[
                {
                  label: "제재 기간",
                  value: (
                    <>
                      {period}
                      {end ? <FactSub>{`${formatFullDateTime(end)}까지`}</FactSub> : null}
                    </>
                  ),
                },
                { label: "사유", value: userReason },
                {
                  label: "취소하는 구인",
                  value: (
                    <>
                      {`${cancelCount}건`}
                      {cancelCount > 0 ? (
                        <FactSub>{`확정자·대기자 ${notifiedCount}명`}</FactSub>
                      ) : null}
                    </>
                  ),
                },
              ]}
            />
            {staffChannel ? (
              <Text typography="body4" foreground="hint">
                운영진 채널에 조치 글을 올립니다.
              </Text>
            ) : null}
          </VStack>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <Button
            ref={backRef}
            variant="outline"
            colorPalette="gray"
            disabled={pending}
            onClick={onBack}
          >
            뒤로
          </Button>
          <Button colorPalette="danger" loading={pending} disabled={pending} onClick={onConfirm}>
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "제재 확정"}
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
