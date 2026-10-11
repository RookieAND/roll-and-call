"use client";

import { VStack } from "@roll-and-call/ui";
import { useRef, type ReactNode } from "react";

import type { CertFormat } from "@/shared/server";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { FOOTER_NOTE_TARGET, footerNote, type FooterNote } from "../model/footer-note";
import type { GroupBook } from "../model/group-book";
import { groupConfirmLabel } from "../model/group-confirm-label";
import { PHOTO_SECTION_ID, REJECT_SECTION_ID } from "../model/section-ids";
import type { ReviewShotKey } from "../model/shots";
import { CertDecisionFooter } from "./cert-decision-footer";
import { GroupBookChecklist } from "./group-book-checklist";
import { GroupDecisionFooter } from "./group-decision-footer";
import { RejectSection } from "./reject-section";
import { ShotSection } from "./shot-section";
import { ShotViewer } from "./shot-viewer";
import { useCertDecision } from "./use-cert-decision";
import { useDecisionKeys } from "./use-decision-keys";

interface CertDecisionFormProps {
  applicationId: string;
  applicantNickname: string;
  rulebookId: string;
  rulebookLabel: string;
  format: CertFormat;
  groupBooks: GroupBook[];
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  previousUrls: Partial<Record<ReviewShotKey, string>>;
  // 재신청이면 사진마다 「새로 올림」·「지난번과 같음」
  freshLabels: Partial<Record<ReviewShotKey, string>>;
  state: CertReviewState;
  proofDeleted: boolean;
  nextHref?: string;
  queueHref: string;
  viewerId: string;
  children: ReactNode;
}

export function CertDecisionForm({
  photoUrls,
  previousUrls,
  freshLabels,
  state,
  proofDeleted,
  nextHref,
  groupBooks,
  children,
  ...decisionOptions
}: CertDecisionFormProps) {
  const approveRef = useRef<HTMLButtonElement>(null);
  const decision = useCertDecision({
    photoUrls,
    state,
    nextHref,
    groupBooks,
    ...decisionOptions,
  });
  const { shots, setParam } = decision;

  const rejectTargetLabels = groupBooks
    .filter(
      (book) => book.status === "pending" && decision.rejectedBookIds.includes(book.applicationId),
    )
    .map((book) => book.label);
  const groupNote = footerNote({
    reviewable: decision.reviewable,
    checkedCount: decision.checkedShots.length,
    checkableCount: decision.checkableShots.length,
    group: {
      approveCount: decision.approveBookCount,
      rejectCount: decision.rejectBookCount,
      reasonReady: decision.reasonReady,
    },
  });
  const groupLabel = groupConfirmLabel({
    approveCount: decision.approveBookCount,
    rejectCount: decision.rejectBookCount,
  });
  // 막힌 이유를 누르면 풀어야 할 곳으로 스크롤하고 첫 입력에 포커스를 둔다.
  const moveToNoteTarget = (note: FooterNote) => {
    const section = document.getElementById(
      note.target === FOOTER_NOTE_TARGET.photos ? PHOTO_SECTION_ID : REJECT_SECTION_ID,
    );
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
    section
      ?.querySelector<HTMLElement>(
        '[role="checkbox"]:not([aria-checked="true"]), [role="radio"], textarea',
      )
      ?.focus({ preventScroll: true });
  };
  const groupApproveOnly = decision.rejectBookCount === 0;

  useDecisionKeys({
    enabled: decision.reviewable && !decision.viewedShot && !decision.pending,
    rejecting: decision.rejecting,
    canApprove: decision.canApprove && (!decision.groupMode || groupApproveOnly),
    onReject: () => {
      if (!decision.groupMode && decision.canStartReject) setParam("mode", "reject");
    },
    onCancelReject: () => setParam("mode", null),
    onApprove: () => void decision.approve(),
    onCheck: (index) => {
      const shot = shots[index];
      if (shot) decision.toggleCheck(shot.key);
    },
  });

  return (
    <>
      <VStack gap="175" className="w-full flex-1 p-200">
        {children}
        {state === CERT_REVIEW_STATE.withdrawn ? null : (
          <ShotSection
            state={state}
            ebook={decision.ebook}
            grouped={groupBooks.length > 0}
            shots={shots}
            photoUrls={photoUrls}
            freshLabels={freshLabels}
            proofDeleted={proofDeleted}
            reviewable={decision.reviewable}
            rejecting={decision.rejecting}
            pending={decision.pending}
            checkedShots={decision.checkedShots}
            checkableCount={decision.checkableShots.length}
            flaggedShots={decision.flaggedShots}
            onToggleCheck={decision.toggleCheck}
            onToggleFlag={decision.toggleFlag}
            onZoom={(key) => setParam("photo", key)}
          />
        )}
        {decision.groupMode ? (
          <GroupBookChecklist
            books={groupBooks}
            rejectedIds={decision.rejectedBookIds}
            disabled={decision.pending}
            approveCount={decision.approveBookCount}
            rejectCount={decision.rejectBookCount}
            onRejectedChange={decision.setBookRejected}
            onSetAll={decision.setAllBooksRejected}
          />
        ) : null}
        {decision.showRejectPanel ? (
          <RejectSection
            ebook={decision.ebook}
            reason={decision.reason}
            userReason={decision.userReason}
            staffMemo={decision.staffMemo}
            previewPayload={decision.previewPayload}
            targetLabels={rejectTargetLabels}
            approvePreviewPayload={decision.approvePreviewPayload}
            onReasonChange={decision.chooseReason}
            onUserReasonChange={decision.setUserReason}
            onStaffMemoChange={decision.setStaffMemo}
          />
        ) : null}
      </VStack>
      <ShotViewer
        shots={shots}
        shot={decision.viewedShot}
        photoUrls={photoUrls}
        previousUrls={previousUrls}
        checkedShots={decision.checkedShots}
        checkableShots={decision.checkableShots}
        finalFocus={approveRef}
        onShotChange={(shot) => setParam("photo", shot)}
        onCheck={decision.checkInViewer}
      />
      {decision.groupMode ? (
        <GroupDecisionFooter
          label={groupLabel}
          note={groupNote}
          danger={decision.approveBookCount === 0}
          canSubmit={decision.canApprove}
          submitting={decision.approving || decision.rejectingPending}
          networkError={decision.approvalNetworkError || decision.rejectionNetworkError}
          showEnterHint={groupApproveOnly}
          approveRef={approveRef}
          onSkip={decision.skip}
          onNoteClick={moveToNoteTarget}
          onSubmit={() => void decision.approve()}
        />
      ) : (
        <CertDecisionFooter
          state={state}
          rejecting={decision.rejecting}
          reviewable={decision.reviewable}
          checkedCount={decision.checkedShots.length}
          checkableCount={decision.checkableShots.length}
          canApprove={decision.canApprove}
          canReject={decision.canReject}
          approving={decision.approving}
          rejectingPending={decision.rejectingPending}
          approvalNetworkError={decision.approvalNetworkError}
          rejectionNetworkError={decision.rejectionNetworkError}
          reason={decision.reason}
          flaggedLabels={decision.flaggedLabels}
          canStartReject={decision.canStartReject}
          nextHref={nextHref}
          approveRef={approveRef}
          onSkip={decision.skip}
          onNoteClick={moveToNoteTarget}
          onStartReject={() => setParam("mode", "reject")}
          onCancelReject={() => setParam("mode", null)}
          onApprove={() => void decision.approve()}
          onReject={() => void decision.reject()}
        />
      )}
    </>
  );
}
