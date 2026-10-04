"use client";

import { Button, Callout, Dialog, HStack, Text, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { Eye, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type RefObject } from "react";

import { REVIEW_REASON, useActionSubmit, type ReviewReason } from "@/shared/lib";
import type { ReviewDetail, ReviewModerationResult } from "@/shared/server";
import { ModalServerLabel, useServerPath } from "@/shared/ui";

import { submitReviewModeration } from "../api/submit-review-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { REASON_ACTIONS, REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import { AuthorMessagePreview } from "./author-message-preview";
import { ImpactLines } from "./impact-lines";
import { ReviewReasonRadio } from "./review-reason-radio";
import { ReviewTarget } from "./review-target";
import { UnhideDetails } from "./unhide-details";

type Failure = Extract<ReviewModerationResult, { ok: false }>;

const CONFIRM_ICON = {
  [REVIEW_ACTION.hide]: Eye,
  [REVIEW_ACTION.unhide]: Eye,
  [REVIEW_ACTION.remove]: X,
} as const;

const IMPACT_LINES: Partial<Record<ReviewAction, [string, string]>> = {
  [REVIEW_ACTION.hide]: ["되돌릴 수 있습니다", "작성자가 고친 뒤 해제를 요청할 수 있습니다"],
  [REVIEW_ACTION.remove]: ["되돌릴 수 없습니다", "본문과 사진이 바로 지워집니다"],
};

interface ReviewActionFormProps {
  review: ReviewDetail;
  action: ReviewAction;
  cancelRef: RefObject<HTMLButtonElement | null>;
  listHref: string;
  onDone: () => void;
  onFailure: (failure: Failure) => void;
}

export function ReviewActionForm({
  review,
  action,
  cancelRef,
  listHref,
  onDone,
  onFailure,
}: ReviewActionFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(submitReviewModeration);
  const needsReason = REASON_ACTIONS.includes(action);
  const [reason, setReason] = useState<ReviewReason | null>(null);

  const copy = ACTION_COPY[action];
  const author = review.author.nickname;
  const removing = action === REVIEW_ACTION.remove;
  const unhiding = action === REVIEW_ACTION.unhide;
  const canConfirm = (!needsReason || !isNull(reason)) && !pending;
  const reasonLabel = reason ? REVIEW_REASON[reason] : null;
  const impactLines = IMPACT_LINES[action];
  const description = copy.description;
  const footerNote = copy.footerNote ?? null;
  const FooterIcon = copy.footerIcon;
  const ConfirmIcon = networkError ? RotateCcw : CONFIRM_ICON[action];
  const confirmLabel = networkError ? "다시 시도" : copy.confirmLabel;
  const confirmPalette = removing ? "danger" : "primary";

  const undoHide = async () => {
    const result = await submitReviewModeration(review.id, {
      action: REVIEW_ACTION.unhide,
      reason: null,
      staffMemo: "숨김 되돌리기",
    });
    if (result.ok) toast.success(ACTION_COPY[REVIEW_ACTION.unhide].successMessage(author));
    else toast.info("다른 운영진이 먼저 처리했습니다");
    router.refresh();
  };

  const confirm = async () => {
    const result = await submit(review.id, { action, reason, staffMemo: "" });
    if (isUndefined(result)) return;
    if (!result.ok) {
      onFailure(result);
      return;
    }
    const message = copy.successMessage(author);
    if (action === REVIEW_ACTION.hide) {
      toast.success(message, { action: { label: "되돌리기", onClick: () => void undoHide() } });
    } else {
      toast.success(message);
    }
    if (removing) router.push(toServerPath(listHref));
    else onDone();
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{copy.title(author)}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {networkError ? (
            <Callout.Root colorPalette="danger" size="sm">
              <Callout.Icon />
              <Callout.Description>{copy.networkError}</Callout.Description>
            </Callout.Root>
          ) : null}
          {unhiding && review.hidden ? (
            <UnhideDetails review={review} hidden={review.hidden} />
          ) : (
            <ReviewTarget review={review} />
          )}
          {impactLines ? <ImpactLines lines={impactLines} danger={removing} /> : null}
          {needsReason ? (
            <>
              <ReviewReasonRadio value={reason} disabled={pending} onValueChange={setReason} />
              <AuthorMessagePreview removing={removing} reasonLabel={reasonLabel} />
            </>
          ) : null}
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        {footerNote ? (
          <HStack align="center" gap="075" className="mr-auto text-hint">
            <FooterIcon size={14} aria-hidden />
            <Text typography="body4" foreground="hint">
              {footerNote}
            </Text>
          </HStack>
        ) : null}
        <Dialog.Close
          ref={cancelRef}
          render={<Button variant="ghost" colorPalette="gray" />}
          disabled={pending}
        >
          취소
        </Dialog.Close>
        <Button
          colorPalette={confirmPalette}
          disabled={!canConfirm}
          loading={pending}
          onClick={() => void confirm()}
        >
          <ConfirmIcon size={16} aria-hidden />
          {confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
