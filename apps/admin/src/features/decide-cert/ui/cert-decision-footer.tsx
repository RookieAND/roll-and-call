import { Button } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";
import type { RefObject } from "react";

import { ActionNetworkError, KeyHint, NextItemButton } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { footerNote } from "../model/footer-note";
import { DecisionFooter } from "./decision-footer";
import { FlaggedStatus } from "./flagged-status";
import { SkipStatus } from "./skip-status";

interface CertDecisionFooterProps {
  state: CertReviewState;
  rejecting: boolean;
  reviewable: boolean;
  allChecked: boolean;
  canApprove: boolean;
  canReject: boolean;
  approving: boolean;
  rejectingPending: boolean;
  approvalNetworkError: boolean;
  rejectionNetworkError: boolean;
  reason: string;
  flaggedLabels: string[];
  groupMode: boolean;
  approveBookCount: number;
  rejectBookCount: number;
  canStartReject: boolean;
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
  allChecked,
  canApprove,
  canReject,
  approving,
  rejectingPending,
  approvalNetworkError,
  rejectionNetworkError,
  reason,
  flaggedLabels,
  groupMode,
  approveBookCount,
  rejectBookCount,
  canStartReject,
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
  const approveLabel = groupMode ? `체크한 ${approveBookCount}권 승인` : "승인";
  const startRejectLabel =
    groupMode && rejectBookCount > 0 ? `체크 해제한 ${rejectBookCount}권 반려` : "반려";
  const rejectLabel = groupMode ? `${rejectBookCount}권 반려 확정` : "반려 확정";
  const note = footerNote({ reviewable, allChecked, groupMode, approveBookCount });

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
          {rejectionNetworkError ? "다시 시도" : rejectLabel}
        </Button>
      </DecisionFooter>
    );
  }
  return (
    <DecisionFooter notice={footerNotice} status={<SkipStatus note={note} onSkip={onSkip} />}>
      <Button
        variant="outline"
        colorPalette="danger"
        disabled={!canStartReject}
        onClick={onStartReject}
      >
        {startRejectLabel}
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
        {approvalNetworkError ? "다시 시도" : approveLabel}
        {approvalNetworkError ? null : <KeyHint keyLabel="⏎" />}
      </Button>
      {state === CERT_REVIEW_STATE.processed ? <NextItemButton href={nextHref} /> : null}
    </DecisionFooter>
  );
}
