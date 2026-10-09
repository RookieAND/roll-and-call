import { Button } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";
import type { RefObject } from "react";

import { ActionNetworkError, KeyHint, NextItemButton } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { DecisionFooter } from "./decision-footer";
import { FlaggedStatus } from "./flagged-status";
import { SkipStatus } from "./skip-status";

interface CertDecisionFooterProps {
  state: CertReviewState;
  rejecting: boolean;
  reviewable: boolean;
  pending: boolean;
  allChecked: boolean;
  canApprove: boolean;
  canReject: boolean;
  approving: boolean;
  rejectingPending: boolean;
  approvalNetworkError: boolean;
  rejectionNetworkError: boolean;
  reason: string;
  flaggedLabels: string[];
  nextHref?: string;
  approveRef: RefObject<HTMLButtonElement | null>;
  onSkip: () => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function CertDecisionFooter({
  state,
  rejecting,
  reviewable,
  pending,
  allChecked,
  canApprove,
  canReject,
  approving,
  rejectingPending,
  approvalNetworkError,
  rejectionNetworkError,
  reason,
  flaggedLabels,
  nextHref,
  approveRef,
  onSkip,
  onStartReject,
  onCancelReject,
  onApprove,
  onReject,
}: CertDecisionFooterProps) {
  const networkError = approvalNetworkError || rejectionNetworkError;
  const footerNotice = networkError ? <ActionNetworkError /> : null;

  if (state === CERT_REVIEW_STATE.withdrawn) {
    return (
      <DecisionFooter>
        <NextItemButton href={nextHref} />
      </DecisionFooter>
    );
  }
  if (rejecting) {
    return (
      <DecisionFooter
        notice={footerNotice}
        status={<FlaggedStatus reason={reason} flaggedLabels={flaggedLabels} />}
      >
        <Button variant="ghost" colorPalette="gray" onClick={onCancelReject}>
          취소
          <KeyHint keyLabel="Esc" />
        </Button>
        <Button
          colorPalette="danger"
          className="min-w-[104px]"
          disabled={!canReject}
          loading={rejectingPending}
          onClick={onReject}
        >
          {rejectionNetworkError ? <RotateCcw size={16} aria-hidden /> : null}
          {rejectionNetworkError ? "다시 시도" : "반려 확정"}
        </Button>
      </DecisionFooter>
    );
  }
  return (
    <DecisionFooter
      notice={footerNotice}
      status={
        <SkipStatus
          note={
            reviewable && !allChecked ? "모든 확인 항목을 체크해야 승인할 수 있습니다" : undefined
          }
          onSkip={onSkip}
        />
      }
    >
      <Button
        variant="outline"
        colorPalette="danger"
        disabled={!reviewable || pending}
        onClick={onStartReject}
      >
        반려
        <KeyHint keyLabel="R" />
      </Button>
      <Button
        ref={approveRef}
        className="min-w-[112px]"
        disabled={!canApprove}
        loading={approving}
        onClick={onApprove}
      >
        {approvalNetworkError ? <RotateCcw size={16} aria-hidden /> : null}
        {approvalNetworkError ? "다시 시도" : "승인"}
        {approvalNetworkError ? null : <KeyHint keyLabel="⏎" />}
      </Button>
      {state === CERT_REVIEW_STATE.processed ? <NextItemButton href={nextHref} /> : null}
    </DecisionFooter>
  );
}
