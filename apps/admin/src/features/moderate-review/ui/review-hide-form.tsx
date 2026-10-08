"use client";

import {
  CONTENT_REASON,
  REASON_TEXT_MAX_LENGTH,
  reasonLabel,
} from "@roll-and-call/database/moderation/model";
import { Button, Dialog, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { Eye, RotateCcw } from "lucide-react";
import { useState } from "react";

import { draftReason, useActionSubmit } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import {
  ActionNetworkError,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
  MODAL_FOOTER_CLASS,
} from "@/shared/ui";

import { submitReviewModeration } from "../api/submit-review-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { REVIEW_ACTION } from "../model/review-action";
import type { ReviewModerationOutcome } from "../model/review-moderation-outcome";

const COPY = ACTION_COPY[REVIEW_ACTION.hide];

interface ReviewHideFormProps {
  review: ReviewDetail;
  onSettled: (outcome: ReviewModerationOutcome) => void;
}

export function ReviewHideForm({ review, onSettled }: ReviewHideFormProps) {
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

  const confirm = async () => {
    const outcome = await submit({
      reviewId: review.id,
      moderation: { action: REVIEW_ACTION.hide, reason },
    });
    if (isUndefined(outcome)) return;
    if (outcome.ok) toast.success(COPY.successMessage);
    onSettled(outcome);
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{COPY.title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
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
      <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
        <Dialog.Close render={<Button variant="outline" colorPalette="gray" />} disabled={pending}>
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
