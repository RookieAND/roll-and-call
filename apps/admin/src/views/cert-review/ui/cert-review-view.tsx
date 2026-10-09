import { Callout } from "@roll-and-call/ui";
import { pick } from "es-toolkit";
import { Quote } from "lucide-react";

import { CERT_REVIEW_STATE, CertDecisionForm } from "@/features/decide-cert";
import { formatDateTime, withQuery } from "@/shared/lib";
import type { CertQueueFilter, CertReview } from "@/shared/server";
import { AdminHeader, ConflictNotice, ItemCard, NextItemButton } from "@/shared/ui";

import { reviewState } from "../model/review-state";
import { ApplicantCard } from "./applicant-card";
import { EbookInputPanel } from "./ebook-input-panel";
import { ReapplyNotice } from "./reapply-notice";
import { WaitingCoreNotice } from "./waiting-core-notice";

const FRESH_LABEL = { new: "새로 올림", same: "지난번과 같음" } as const;

interface CertReviewViewProps {
  review: CertReview;
  viewerId: string;
  filter: CertQueueFilter;
}

export function CertReviewView({ review, viewerId, filter }: CertReviewViewProps) {
  const { applicant, latestRejection, withdrawnAt, purchase, duplicate } = review;
  const state = reviewState(review);
  const ebook = review.format === "ebook";
  const query = { q: filter.query, rulebook: filter.rulebook, filter: filter.filter };
  const queueHref = withQuery("/cert", query, {});
  const nextHref = review.nextId ? withQuery(`/cert/${review.nextId}`, query, {}) : undefined;
  const waitingCore = review.waitingOn[0];
  const photoUrls = ebook
    ? { order: purchase.captureUrl ?? undefined, receipt: purchase.receiptUrl ?? undefined }
    : review.photoUrls;
  const previousUrls = latestRejection
    ? pick(latestRejection.photoUrls, latestRejection.flaggedShots)
    : {};
  const freshLabels =
    latestRejection && !ebook
      ? Object.fromEntries(
          (["front", "back", "side"] as const).map((shot) => [
            shot,
            review.replacedShots.includes(shot) ? FRESH_LABEL.new : FRESH_LABEL.same,
          ]),
        )
      : {};
  const dimmed = state === CERT_REVIEW_STATE.waiting || state === CERT_REVIEW_STATE.withdrawn;

  return (
    <>
      <AdminHeader
        title="룰북 인증 심사"
        trail={[
          { href: queueHref, label: "룰북 인증" },
          { href: queueHref, label: "심사 대기열" },
        ]}
        actions={<NextItemButton href={nextHref} />}
      />
      <CertDecisionForm
        applicationId={review.id}
        applicantNickname={applicant.nickname}
        rulebookId={review.rulebookId}
        rulebookLabel={review.rulebook}
        format={review.format}
        photoUrls={photoUrls}
        previousUrls={previousUrls}
        freshLabels={freshLabels}
        state={state}
        proofDeleted={review.proofDeleted}
        nextHref={nextHref}
        queueHref={queueHref}
        viewerId={viewerId}
      >
        <ApplicantCard review={review} />
        {waitingCore ? (
          <WaitingCoreNotice
            coreLabel={waitingCore.label}
            coreHref={withQuery(`/cert/${waitingCore.applicationId}`, query, {})}
            nextHref={nextHref}
          />
        ) : null}
        {withdrawnAt ? (
          <ConflictNotice
            title="신청자가 신청을 거뒀습니다"
            description={`${formatDateTime(withdrawnAt)}에 거둔 신청이며, 올린 사진도 함께 삭제되었습니다.`}
            actions={<NextItemButton href={nextHref} />}
          />
        ) : null}
        {duplicate && state === CERT_REVIEW_STATE.open ? (
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Title>이미 다른 신청에 쓰인 주문번호입니다</Callout.Title>
            <Callout.Description>
              {duplicate.nickname}님의 신청에서 같은 판매처와 주문번호가 확인되었습니다. 이 경고를
              참고해서 판단해 주세요.
            </Callout.Description>
          </Callout.Root>
        ) : null}
        {latestRejection && !withdrawnAt ? (
          <ReapplyNotice latest={latestRejection} attempt={review.previousRejectionCount + 1} />
        ) : null}
        {review.memo ? (
          <div className={dimmed ? "opacity-50" : undefined}>
            <ItemCard icon={Quote} tone="primary" title="신청 메모" meta={applicant.nickname}>
              {review.memo}
            </ItemCard>
          </div>
        ) : null}
        {ebook && !withdrawnAt ? (
          <EbookInputPanel
            purchase={purchase}
            sellerRegistered={review.sellerRegistered}
            duplicate={Boolean(duplicate)}
          />
        ) : null}
      </CertDecisionForm>
    </>
  );
}
