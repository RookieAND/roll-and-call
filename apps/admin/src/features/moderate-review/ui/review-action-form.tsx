"use client";

import { Button, Callout, Dialog, HStack, Text, VStack, cn, toast } from "@roll-and-call/ui";
import { Check, Eye, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { REVIEW_REASON, type ReviewReason } from "@/shared/lib";
import type { ReviewDetail, ReviewModerationResult } from "@/shared/server";

import { submitReviewModeration } from "../api/submit-review-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { REASON_ACTIONS, REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import { AuthorMessagePreview } from "./author-message-preview";
import { ImpactLines } from "./impact-lines";
import { ReportSummary } from "./report-summary";
import { ReviewFailureNotice } from "./review-failure-notice";
import { ReviewReasonRadio } from "./review-reason-radio";
import { ReviewTarget } from "./review-target";
import { StaffMemoField } from "./staff-memo-field";
import { SwitchToHide } from "./switch-to-hide";
import { UnhideDetails } from "./unhide-details";

type Failure = Extract<ReviewModerationResult, { ok: false }>;

const CONFIRM_ICON = {
  [REVIEW_ACTION.hide]: Eye,
  [REVIEW_ACTION.unhide]: Eye,
  [REVIEW_ACTION.remove]: X,
  [REVIEW_ACTION.dismiss]: Check,
} as const;

const IMPACT_LINES: Partial<Record<ReviewAction, [string, string]>> = {
  [REVIEW_ACTION.hide]: ["되돌릴 수 있습니다", "작성자가 고친 뒤 해제를 요청할 수 있습니다"],
  [REVIEW_ACTION.remove]: ["되돌릴 수 없습니다", "본문과 사진이 바로 지워집니다"],
};

interface ReviewActionFormProps {
  review: ReviewDetail;
  action: ReviewAction;
  fromReports: boolean;
  onDone: () => void;
  onSwitchAction: (action: ReviewAction) => void;
}

export function ReviewActionForm({
  review,
  action,
  fromReports,
  onDone,
  onSwitchAction,
}: ReviewActionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const needsReason = REASON_ACTIONS.includes(action);
  const [reason, setReason] = useState<ReviewReason | null>(
    needsReason ? ((review.topReasonKey as ReviewReason | undefined) ?? null) : null,
  );
  const [staffMemo, setStaffMemo] = useState("");
  const [failure, setFailure] = useState<Failure | null>(null);
  const [networkError, setNetworkError] = useState(false);

  const copy = ACTION_COPY[action];
  const author = review.author.nickname;
  const reportCount = review.reports.length;
  const removing = action === REVIEW_ACTION.remove;
  const unhiding = action === REVIEW_ACTION.unhide;
  const blocked = failure !== null;
  const canConfirm = (!needsReason || reason !== null) && !pending && !blocked;
  const reasonLabel = reason ? REVIEW_REASON[reason] : null;
  const impactLines = IMPACT_LINES[action];
  const description =
    action === REVIEW_ACTION.dismiss
      ? `후기는 그대로 두고 신고 ${reportCount}건을 닫습니다`
      : copy.description;
  const footerNote = copy.footerNote ?? (reportCount ? `신고 ${reportCount}건도 처리됩니다` : null);
  const FooterIcon = copy.footerIcon;
  const ConfirmIcon = networkError ? RotateCcw : CONFIRM_ICON[action];
  const confirmLabel = networkError ? "다시 시도" : copy.confirmLabel;
  const cancelLabel = blocked ? "닫기" : "취소";
  const confirmPalette = removing ? "danger" : "primary";
  const nextHref = fromReports
    ? review.nextReportedId
      ? `/posts/reviews/${review.nextReportedId}?from=reports`
      : "/posts/reviews"
    : null;

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

  const confirm = () =>
    startTransition(async () => {
      setNetworkError(false);
      let result: ReviewModerationResult;
      try {
        result = await submitReviewModeration(review.id, { action, reason, staffMemo });
      } catch {
        setNetworkError(true);
        return;
      }
      if (!result.ok) {
        setFailure(result);
        return;
      }
      const message = nextHref
        ? `${copy.successMessage(author)}. 다음 신고로 이동했습니다`
        : copy.successMessage(author);
      if (action === REVIEW_ACTION.hide) {
        toast.success(message, { action: { label: "되돌리기", onClick: () => void undoHide() } });
      } else {
        toast.success(message);
      }
      if (nextHref) router.push(nextHref);
      else if (removing) router.push(`/posts/${review.session.id}?tab=reviews`);
      else onDone();
    });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>{copy.title(author)}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {failure ? <ReviewFailureNotice failure={failure} /> : null}
          {networkError ? (
            <Callout.Root colorPalette="danger" size="sm">
              <Callout.Icon />
              <Callout.Description>
                네트워크 오류로 처리하지 못했습니다. 고른 사유는 그대로 남아 있습니다.
              </Callout.Description>
            </Callout.Root>
          ) : null}
          <VStack gap="150" className={cn(blocked && "pointer-events-none opacity-50")}>
            {unhiding && review.hidden ? (
              <UnhideDetails review={review} hidden={review.hidden} />
            ) : (
              <ReviewTarget review={review} />
            )}
            {!unhiding && reportCount ? <ReportSummary reasonCounts={review.reasonCounts} /> : null}
            {impactLines ? <ImpactLines lines={impactLines} danger={removing} /> : null}
            {needsReason ? (
              <>
                <ReviewReasonRadio value={reason} disabled={blocked} onValueChange={setReason} />
                <AuthorMessagePreview removing={removing} reasonLabel={reasonLabel} />
              </>
            ) : null}
            {action === REVIEW_ACTION.dismiss ? (
              <StaffMemoField value={staffMemo} disabled={blocked} onValueChange={setStaffMemo} />
            ) : null}
            {removing ? <SwitchToHide onSwitch={() => onSwitchAction(REVIEW_ACTION.hide)} /> : null}
          </VStack>
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
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          {cancelLabel}
        </Dialog.Close>
        {blocked ? null : (
          <Button
            colorPalette={confirmPalette}
            disabled={!canConfirm}
            loading={pending}
            onClick={confirm}
          >
            <ConfirmIcon size={16} aria-hidden />
            {confirmLabel}
          </Button>
        )}
      </Dialog.Footer>
    </>
  );
}
