"use client";

import { VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import type { CertFormat } from "@/shared/server";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { FOOTER_NOTE_TARGET, footerNote, type FooterNote } from "../model/footer-note";
import type { GroupBook } from "../model/group-book";
import { groupConfirmLabel } from "../model/group-confirm-label";
import { MOBILE_PHOTO_SECTION_ID, MOBILE_REJECT_SECTION_ID } from "../model/section-ids";
import type { ReviewShotKey } from "../model/shots";
import { MobileDecisionFooter } from "./mobile-decision-footer";
import { MobileGroupBookList } from "./mobile-group-book-list";
import { MobileGroupDecisionFooter } from "./mobile-group-decision-footer";
import { MobileRejectPanel } from "./mobile-reject-panel";
import { MobileShotSection } from "./mobile-shot-section";
import { MobileShotViewer } from "./mobile-shot-viewer";
import { useCertDecision } from "./use-cert-decision";

interface MobileCertDecisionFormProps {
  applicationId: string;
  applicantNickname: string;
  rulebookId: string;
  rulebookLabel: string;
  format: CertFormat;
  groupBooks: GroupBook[];
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  previousUrls: Partial<Record<ReviewShotKey, string>>;
  freshLabels: Partial<Record<ReviewShotKey, string>>;
  state: CertReviewState;
  proofDeleted: boolean;
  nextHref?: string;
  queueHref: string;
  viewerId: string;
  children: ReactNode;
}

// 데스크톱 폼과 같은 판정(useCertDecision)을 쓰고 배치만 모바일이다.
// 확대 창은 주소(photo) 대신 이 화면의 상태로 연다. 같은 주소를 보는 데스크톱 확대 창이 함께 열리지 않게 한다.
export function MobileCertDecisionForm({
  photoUrls,
  previousUrls,
  freshLabels,
  state,
  proofDeleted,
  nextHref,
  groupBooks,
  children,
  ...decisionOptions
}: MobileCertDecisionFormProps) {
  const decision = useCertDecision({ photoUrls, state, nextHref, groupBooks, ...decisionOptions });
  const [zoomedShot, setZoomedShot] = useState<ReviewShotKey | null>(null);
  const { setParam } = decision;

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
  const moveToNoteTarget = (note: FooterNote) => {
    const section = document.getElementById(
      note.target === FOOTER_NOTE_TARGET.photos
        ? MOBILE_PHOTO_SECTION_ID
        : MOBILE_REJECT_SECTION_ID,
    );
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
        {children}
        {state === CERT_REVIEW_STATE.withdrawn ? null : (
          <MobileShotSection
            state={state}
            ebook={decision.ebook}
            grouped={groupBooks.length > 0}
            shots={decision.shots}
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
            onZoom={setZoomedShot}
          />
        )}
        {decision.groupMode ? (
          <MobileGroupBookList
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
          <MobileRejectPanel
            ebook={decision.ebook}
            reason={decision.reason}
            userReason={decision.userReason}
            staffMemo={decision.staffMemo}
            targetLabels={rejectTargetLabels}
            previewPayload={decision.previewPayload}
            approvePreviewPayload={decision.approvePreviewPayload}
            onReasonChange={decision.chooseReason}
            onUserReasonChange={decision.setUserReason}
            onStaffMemoChange={decision.setStaffMemo}
          />
        ) : null}
      </VStack>
      <MobileShotViewer
        shots={decision.shots}
        shot={zoomedShot}
        photoUrls={photoUrls}
        previousUrls={previousUrls}
        checkedShots={decision.checkedShots}
        checkableShots={decision.checkableShots}
        onShotChange={setZoomedShot}
        onCheck={decision.toggleCheck}
      />
      {decision.groupMode ? (
        <MobileGroupDecisionFooter
          label={groupConfirmLabel({
            approveCount: decision.approveBookCount,
            rejectCount: decision.rejectBookCount,
          })}
          note={groupNote}
          approveCount={decision.approveBookCount}
          rejectCount={decision.rejectBookCount}
          danger={decision.approveBookCount === 0}
          canSubmit={decision.canApprove}
          submitting={decision.approving || decision.rejectingPending}
          networkError={decision.approvalNetworkError || decision.rejectionNetworkError}
          onSkip={decision.skip}
          onNoteClick={moveToNoteTarget}
          onSubmit={() => void decision.approve()}
        />
      ) : (
        <MobileDecisionFooter
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
