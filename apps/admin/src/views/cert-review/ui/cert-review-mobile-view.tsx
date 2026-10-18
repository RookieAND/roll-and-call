import { objectParticle } from "@roll-and-call/app-kit/lib";
import { Button, Callout, VStack } from "@roll-and-call/ui";
import { pick } from "es-toolkit";

import type { CertQueueFilter } from "@/entities/cert";
import type { CertReview } from "@/entities/cert/server";
import { CERT_REVIEW_STATE, MobileCertDecisionForm } from "@/features/decide-cert";
import { formatFullDateTime, withQuery } from "@/shared/lib";
import { AdminHeader, ServerLink } from "@/shared/ui";

import { reviewState } from "../model/review-state";
import { ApplicantMobileCard } from "./mobile/applicant-mobile-card";
import { EbookInputMobileCard } from "./mobile/ebook-input-mobile-card";
import { GroupBooksMobileNotice } from "./mobile/group-books-mobile-notice";
import { ReapplyMobileCard } from "./mobile/reapply-mobile-card";

interface CertReviewMobileViewProps {
  review: CertReview;
  viewerId: string;
  filter: CertQueueFilter;
}

export function CertReviewMobileView({ review, viewerId, filter }: CertReviewMobileViewProps) {
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

  return (
    <>
      <AdminHeader title="룰북 인증 심사" trail={[{ href: queueHref, label: "심사 대기열" }]} />
      <MobileCertDecisionForm
        applicationId={review.id}
        applicantNickname={applicant.nickname}
        rulebookId={review.rulebookId}
        rulebookLabel={review.rulebook}
        format={review.format}
        groupBooks={review.groupBooks.map((book) => ({
          applicationId: book.applicationId,
          label: book.label,
          status: book.status,
          href: withQuery(`/cert/${book.applicationId}`, query, {}),
        }))}
        photoUrls={photoUrls}
        previousUrls={previousUrls}
        state={state}
        proofDeleted={review.proofDeleted}
        nextHref={nextHref}
        queueHref={queueHref}
        viewerId={viewerId}
      >
        {withdrawnAt ? (
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Title>신청자가 신청을 거뒀습니다</Callout.Title>
            <Callout.Description>{`${formatFullDateTime(withdrawnAt)}에 거둔 신청이며, 올린 사진도 함께 삭제되었습니다.`}</Callout.Description>
          </Callout.Root>
        ) : null}
        {waitingCore ? (
          <VStack gap="100">
            <Callout.Root colorPalette="primary">
              <Callout.Icon />
              <Callout.Title>기본 룰북 심사가 먼저 필요합니다</Callout.Title>
              <Callout.Description>{`${waitingCore.label}${objectParticle(waitingCore.label)} 먼저 심사해야 이 서플리먼트를 처리할 수 있습니다.`}</Callout.Description>
            </Callout.Root>
            <Button
              variant="outline"
              colorPalette="gray"
              className="min-h-11 w-full"
              render={
                <ServerLink path={withQuery(`/cert/${waitingCore.applicationId}`, query, {})} />
              }
            >
              그 신청 열기
            </Button>
          </VStack>
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
        <ApplicantMobileCard review={review} />
        {review.groupBooks.length > 0 && state !== CERT_REVIEW_STATE.open ? (
          <GroupBooksMobileNotice
            books={review.groupBooks.map((book) => ({
              label: book.label,
              status: book.status,
              current: book.current,
              href: withQuery(`/cert/${book.applicationId}`, query, {}),
            }))}
          />
        ) : null}
        {latestRejection && !withdrawnAt ? (
          <ReapplyMobileCard latest={latestRejection} attempt={review.previousRejectionCount + 1} />
        ) : null}
        {ebook && !withdrawnAt ? (
          <EbookInputMobileCard
            purchase={purchase}
            sellerRegistered={review.sellerRegistered}
            duplicate={Boolean(duplicate)}
          />
        ) : null}
      </MobileCertDecisionForm>
    </>
  );
}
