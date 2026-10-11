"use client";

import { VStack } from "@roll-and-call/ui";
import { useRef, type ReactNode } from "react";

import type { CertFormat } from "@/shared/server";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import type { GroupBook } from "../model/group-book";
import type { ReviewShotKey } from "../model/shots";
import { CertDecisionFooter } from "./cert-decision-footer";
import { GroupBookChecklist } from "./group-book-checklist";
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

  useDecisionKeys({
    enabled: decision.reviewable && !decision.viewedShot && !decision.pending,
    rejecting: decision.rejecting,
    canApprove: decision.canApprove,
    onReject: () => {
      if (decision.canStartReject) setParam("mode", "reject");
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
            uncheckedIds={decision.uncheckedBookIds}
            disabled={decision.pending}
            allChecked={decision.allBooksChecked}
            onToggle={decision.toggleBook}
            onToggleAll={decision.toggleAllBooks}
          />
        ) : null}
        {decision.rejecting ? (
          <RejectSection
            ebook={decision.ebook}
            reason={decision.reason}
            userReason={decision.userReason}
            staffMemo={decision.staffMemo}
            previewPayload={decision.previewPayload}
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
      <CertDecisionFooter
        state={state}
        rejecting={decision.rejecting}
        reviewable={decision.reviewable}
        allChecked={decision.allChecked}
        canApprove={decision.canApprove}
        canReject={decision.canReject}
        approving={decision.approving}
        rejectingPending={decision.rejectingPending}
        approvalNetworkError={decision.approvalNetworkError}
        rejectionNetworkError={decision.rejectionNetworkError}
        reason={decision.reason}
        flaggedLabels={decision.flaggedLabels}
        groupMode={decision.groupMode}
        approveBookCount={decision.approveBookCount}
        rejectBookCount={decision.rejectBookCount}
        canStartReject={decision.canStartReject}
        nextHref={nextHref}
        approveRef={approveRef}
        onSkip={decision.skip}
        onStartReject={() => setParam("mode", "reject")}
        onCancelReject={() => setParam("mode", null)}
        onApprove={() => void decision.approve()}
        onReject={() => void decision.reject()}
      />
    </>
  );
}
