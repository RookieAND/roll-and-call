"use client";

import { Button, Callout, Dialog, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw, X } from "lucide-react";
import { useState, type RefObject } from "react";

import { useActionSubmit, type ReviewReason } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, NotificationPreview } from "@/shared/ui";

import { submitReviewModeration } from "../api/submit-review-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { REVIEW_ACTION } from "../model/review-action";
import type { ReviewModerationOutcome } from "../model/review-moderation-outcome";
import { reviewReasonText } from "../model/review-reason-text";
import { ReviewReasonField } from "./review-reason-field";

const COPY = ACTION_COPY[REVIEW_ACTION.remove];

interface ReviewRemoveFormProps {
  review: ReviewDetail;
  cancelRef: RefObject<HTMLButtonElement | null>;
  onSettled: (outcome: ReviewModerationOutcome) => void;
}

export function ReviewRemoveForm({ review, cancelRef, onSettled }: ReviewRemoveFormProps) {
  const { pending, networkError, submit } = useActionSubmit(submitReviewModeration);
  const [reasonKey, setReasonKey] = useState<ReviewReason | null>(null);
  const [otherText, setOtherText] = useState("");
  const reason = reviewReasonText({ reasonKey, otherText });
  const canConfirm = Boolean(reason) && !pending;
  const payload = reason
    ? {
        kind: "review_deleted" as const,
        params: { gameId: review.game.id, gameTitle: review.game.title, reason },
      }
    : null;

  const confirm = async () => {
    const outcome = await submit({
      reviewId: review.id,
      moderation: { action: REVIEW_ACTION.remove, reasonKey, otherText },
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
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          <Callout.Root colorPalette="danger" size="sm">
            <Callout.Icon />
            <Callout.Description>
              지운 후기는 되돌릴 수 없습니다.
              <br />
              작성자는 이 세션의 후기를 다시 쓸 수 없습니다.
            </Callout.Description>
          </Callout.Root>
          <ReviewReasonField
            reasonKey={reasonKey}
            otherText={otherText}
            disabled={pending}
            onReasonKeyChange={setReasonKey}
            onOtherTextChange={setOtherText}
          />
          <NotificationPreview payload={payload} />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close
          ref={cancelRef}
          render={<Button variant="ghost" colorPalette="gray" />}
          disabled={pending}
        >
          취소
        </Dialog.Close>
        <Button
          colorPalette="danger"
          disabled={!canConfirm}
          loading={pending}
          onClick={() => void confirm()}
        >
          {networkError ? <RotateCcw size={16} aria-hidden /> : <X size={16} aria-hidden />}
          {networkError ? "다시 시도" : COPY.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
