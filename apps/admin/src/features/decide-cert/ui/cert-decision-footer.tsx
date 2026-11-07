import { Button } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import type { RefObject } from "react";

import { ActionNetworkError, KeyHint, NextItemButton } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { footerNote, type FooterNote } from "../model/footer-note";
import { DecisionFooter } from "./decision-footer";
import { FlaggedStatus } from "./flagged-status";
import { FooterNoteStatus } from "./footer-note-status";
import { SkipStatus } from "./skip-status";

interface CertDecisionFooterProps {
  state: CertReviewState;
  rejecting: boolean;
  checkedCount: number;
  checkableCount: number;
  canApprove: boolean;
  canReject: boolean;
  approving: boolean;
  rejectingPending: boolean;
  approvalNetworkError: boolean;
  rejectionNetworkError: boolean;
  reason: string;
  reasonPicked: boolean;
  userReasonFilled: boolean;
  flaggedLabels: string[];
  canStartReject: boolean;
  nextHref?: string;
  approveRef: RefObject<HTMLButtonElement | null>;
  onSkip: () => void;
  onNoteClick: (note: FooterNote) => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function CertDecisionFooter({
  state,
  rejecting,
  checkedCount,
  checkableCount,
  canApprove,
  canReject,
  approving,
  rejectingPending,
  approvalNetworkError,
  rejectionNetworkError,
  reason,
  reasonPicked,
  userReasonFilled,
  flaggedLabels,
  canStartReject,
  nextHref,
  approveRef,
  onSkip,
  onNoteClick,
  onStartReject,
  onCancelReject,
  onApprove,
  onReject,
}: CertDecisionFooterProps) {
  const networkError = approvalNetworkError || rejectionNetworkError;
  const footerNotice = networkError ? <ActionNetworkError /> : null;
  const note = footerNote({
    state,
    checkedCount,
    checkableCount,
    rejecting,
    reasonPicked,
    userReasonFilled,
  });

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
        status={
          note && !canReject ? (
            <FooterNoteStatus note={note} onNoteClick={onNoteClick} />
          ) : (
            <FlaggedStatus reason={reason} flaggedLabels={flaggedLabels} />
          )
        }
      >
        <Button
          variant="ghost"
          colorPalette="gray"
          disabled={rejectingPending}
          onClick={onCancelReject}
        >
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
          note={note}
          skipDisabled={isUndefined(nextHref)}
          onSkip={onSkip}
          onNoteClick={onNoteClick}
        />
      }
    >
      <Button
        variant="outline"
        colorPalette="danger"
        disabled={!canStartReject}
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
