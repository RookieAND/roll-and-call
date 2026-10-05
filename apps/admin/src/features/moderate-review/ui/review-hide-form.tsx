"use client";

import {
  CONTENT_REASON,
  REASON_TEXT_MAX_LENGTH,
  reasonLabel,
} from "@roll-and-call/database/moderation/model";
import { Button, Dialog, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { Eye, RotateCcw } from "lucide-react";
import { useState } from "react";

import { draftReason, useActionSubmit } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import {
  ActionNetworkError,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
} from "@/shared/ui";

import { submitReviewModeration } from "../api/submit-review-moderation";
import { undoReviewHide } from "../api/undo-review-hide";
import { ACTION_COPY } from "../model/action-copy";
import { REVIEW_ACTION } from "../model/review-action";
import type { ReviewModerationOutcome } from "../model/review-moderation-outcome";

const COPY = ACTION_COPY[REVIEW_ACTION.hide];

interface ReviewHideFormProps {
  review: ReviewDetail;
  onSettled: (outcome: ReviewModerationOutcome) => void;
  onUndoSettled: (outcome: ReviewModerationOutcome | null) => void;
}

export function ReviewHideForm({ review, onSettled, onUndoSettled }: ReviewHideFormProps) {
  const { pending, networkError, submit } = useActionSubmit(submitReviewModeration);
  const [code, setCode] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const reason = draftReason({ code, otherText });
  const canConfirm = Boolean(reason) && !pending;
  const payload = reason
    ? {
        kind: "review_hidden" as const,
        params: {
          gameId: review.game.id,
          gameTitle: review.game.title,
          reason: reasonLabel({ ...reason, reasons: CONTENT_REASON }),
        },
      }
    : null;

  const undo = async () => {
    const outcome = await undoReviewHide(review.id).catch(() => null);
    if (isNull(outcome)) toast.danger("네트워크 오류로 처리하지 못했습니다.");
    else if (outcome.ok) toast.success("숨김을 되돌렸습니다");
    onUndoSettled(outcome);
  };

  const confirm = async () => {
    const outcome = await submit({
      reviewId: review.id,
      moderation: { action: REVIEW_ACTION.hide, reason },
    });
    if (isUndefined(outcome)) return;
    if (outcome.ok) {
      toast.success(COPY.successMessage, {
        action: { label: "되돌리기", onClick: () => void undo() },
      });
    }
    onSettled(outcome);
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{COPY.title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          <ReasonChips
            label="사유"
            reasons={CONTENT_REASON}
            value={code}
            otherText={otherText}
            onValueChange={setCode}
            onOtherTextChange={setOtherText}
            otherPlaceholder="작성자에게 보일 사유를 적어 주세요"
            otherMaxLength={REASON_TEXT_MAX_LENGTH}
            help={code ? undefined : "사유를 고르면 확정할 수 있습니다"}
            disabled={pending}
            regularWeight
          />
          <NotificationPreview payload={payload} />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button disabled={!canConfirm} loading={pending} onClick={() => void confirm()}>
          {networkError ? <RotateCcw size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
          {networkError ? "다시 시도" : COPY.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
