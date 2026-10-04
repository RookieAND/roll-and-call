"use client";

import { Callout, Field, Textarea, VStack } from "@roll-and-call/ui";
import { useId, useState } from "react";

import { BrandMark } from "@/entities/profile";
import { ConfirmDialog, LineBreaks } from "@/shared/ui";

import { CANCEL_REASON_MAX_LENGTH } from "../model/cancel-reason-error";
import { useCancelGame } from "../model/use-cancel-game";

const DISCORD_LINES = [
  "디스코드 모집 공지에 취소가 표시됩니다.",
  "구인 스레드에 취소 사유와 함께 알립니다.",
  "스레드는 지우지 않고 그대로 둡니다.",
];

interface CancelGameDialogProps {
  gameId: string;
  notifyCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelGameDialog({
  gameId,
  notifyCount,
  open,
  onOpenChange,
}: CancelGameDialogProps) {
  const [reason, setReason] = useState("");
  const reasonId = useId();
  const { pending, failed, cancel, resetFailed } = useCancelGame({
    gameId,
    onClose: () => onOpenChange(false),
  });

  const descriptionLines = [
    "이 구인을 취소할까요?",
    "취소한 구인은 「취소됨」으로 남고 되돌릴 수 없습니다.",
    ...(notifyCount > 0
      ? [`확정자·대기자 ${notifyCount}명에게 알림 탭과 구인 스레드로 알립니다.`]
      : []),
  ];
  const confirmLabel = failed ? "다시 시도" : "구인 취소";

  function changeOpen(nextOpen: boolean) {
    if (!nextOpen) resetFailed();
    onOpenChange(nextOpen);
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={changeOpen}
      title="구인 취소"
      description={<LineBreaks lines={descriptionLines} />}
      confirmLabel={confirmLabel}
      cancelLabel="닫기"
      danger
      pending={pending}
      confirmDisabled={reason.trim().length === 0}
      onConfirm={() => cancel(reason)}
    >
      <VStack gap="150">
        {failed && !pending && (
          <Callout.Root colorPalette="danger" size="sm">
            <Callout.Icon />
            <Callout.Description>
              <LineBreaks lines={["취소하지 못했습니다.", "입력한 내용은 그대로 있습니다."]} />
            </Callout.Description>
          </Callout.Root>
        )}
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Icon>
            <BrandMark service="discord" size={16} />
          </Callout.Icon>
          <Callout.Description>
            <LineBreaks lines={DISCORD_LINES} />
          </Callout.Description>
        </Callout.Root>
        <Field.Root
          label="취소 사유"
          required
          htmlFor={reasonId}
          counter={`${reason.length} / ${CANCEL_REASON_MAX_LENGTH}`}
          description="참여자가 구인 상세와 구인 스레드에서 볼 수 있습니다."
        >
          <Textarea
            id={reasonId}
            rows={3}
            value={reason}
            maxLength={CANCEL_REASON_MAX_LENGTH}
            placeholder="예: GM 사정으로 일정을 맞출 수 없게 됐습니다."
            disabled={pending}
            onChange={(event) => setReason(event.target.value)}
          />
        </Field.Root>
      </VStack>
    </ConfirmDialog>
  );
}
