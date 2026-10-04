"use client";

import { Button, Callout, Dialog, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { Eye, RotateCcw } from "lucide-react";

import { useActionSubmit } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, NotificationPreview } from "@/shared/ui";

import { submitReviewModeration } from "../api/submit-review-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { REVIEW_ACTION } from "../model/review-action";
import type { ReviewModerationOutcome } from "../model/review-moderation-outcome";

const COPY = ACTION_COPY[REVIEW_ACTION.unhide];

interface ReviewUnhideFormProps {
  review: ReviewDetail;
  onSettled: (outcome: ReviewModerationOutcome) => void;
}

// 해제하면 작성자에게 알림이 가므로 작은 확인 창을 둔다(D273). 뒤 화면의 사유·본문은 다시 그리지 않는다.
export function ReviewUnhideForm({ review, onSettled }: ReviewUnhideFormProps) {
  const { pending, networkError, submit } = useActionSubmit(submitReviewModeration);

  const confirm = async () => {
    const outcome = await submit({
      reviewId: review.id,
      moderation: { action: REVIEW_ACTION.unhide, reasonKey: null, otherText: "" },
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
          {review.held ? (
            <Callout.Root colorPalette="gray" size="sm">
              <Callout.Icon />
              <Callout.Description>
                작성자가 불참으로 기록되어 해제해도 공개되지 않습니다.
              </Callout.Description>
            </Callout.Root>
          ) : null}
          <NotificationPreview
            payload={{
              kind: "review_unhidden",
              params: { gameId: review.game.id, gameTitle: review.game.title },
            }}
          />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button loading={pending} disabled={pending} onClick={() => void confirm()}>
          {networkError ? <RotateCcw size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
          {networkError ? "다시 시도" : COPY.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
