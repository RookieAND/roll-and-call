import { Button, Callout } from "@roll-and-call/ui";
import { Quote } from "lucide-react";

import { CertDecisionForm } from "@/features/decide-cert";
import { formatDateTime } from "@/shared/lib";
import type { CertReview } from "@/shared/server";
import { AdminHeader, ConflictNotice, ItemCard, ServerLink } from "@/shared/ui";

import { processedConflictTitle } from "../model/processed-conflict-title";
import { ApplicantCard } from "./applicant-card";
import { EbookInputPanel } from "./ebook-input-panel";
import { QuizPanel } from "./quiz-panel";
import { ReapplyNotice } from "./reapply-notice";

interface CertReviewViewProps {
  review: CertReview;
  viewer: string;
  rejecting: boolean;
}

export function CertReviewView({ review, viewer, rejecting }: CertReviewViewProps) {
  const { applicant, previousRejections, processed, withdrawnAt, purchase } = review;
  const closed = Boolean(processed || withdrawnAt);
  const ebook = review.format === "ebook";
  const photoUrls = ebook
    ? { order: purchase.captureUrl, receipt: purchase.receiptUrl }
    : review.photoUrls;
  const waitingOn = review.blockers?.waitingOn ?? [];
  const duplicate = review.blockers?.duplicate ?? null;
  const latestRejection = previousRejections.at(-1);
  const reapplied = Boolean(latestRejection);
  const nextHref = review.nextId ? `/cert/${review.nextId}` : "/cert";
  const conflictTitle = processedConflictTitle({ processed, viewer });

  return (
    <>
      <AdminHeader
        title="룰북 인증 심사"
        sub={review.position ? `${review.position.index} / ${review.position.total}` : undefined}
      />
      <CertDecisionForm
        applicationId={review.id}
        applicantLabel={`${applicant.nickname} · ${review.rulebook}`}
        format={review.format}
        photoUrls={photoUrls}
        nextId={review.nextId}
        compact={reapplied || closed || waitingOn.length > 0}
        disabled={closed || waitingOn.length > 0}
        hideShots={Boolean(withdrawnAt)}
        quiz={closed || (ebook && rejecting) ? null : <QuizPanel quiz={review.quiz} />}
      >
        <ApplicantCard review={review} />
        {duplicate && !rejecting ? (
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Description>
              이미 다른 사용자({duplicate.nickname})의 신청에 쓰인 주문번호입니다. 이 경고를
              참고해서 판단해 주세요.
            </Callout.Description>
          </Callout.Root>
        ) : null}
        {withdrawnAt ? (
          <ConflictNotice
            title="신청자가 신청을 거뒀습니다"
            description={`${formatDateTime(withdrawnAt)}에 거둔 신청이며, 올린 사진도 함께 삭제되었습니다.`}
            actions={
              <Button size="sm" render={<ServerLink path={nextHref} />}>
                다음 건
              </Button>
            }
          />
        ) : null}
        {processed ? (
          <ConflictNotice
            title={conflictTitle}
            description={`${formatDateTime(processed.at)}에 처리되었으므로 이 신청은 더 이상 심사할 수 없습니다.`}
            actions={
              <>
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={
                    <ServerLink path={`/log?target=${encodeURIComponent(applicant.nickname)}`} />
                  }
                >
                  활동 기록에서 보기
                </Button>
                <Button size="sm" render={<ServerLink path={nextHref} />}>
                  다음 건
                </Button>
              </>
            }
          />
        ) : null}
        {latestRejection && !rejecting && !processed ? (
          <ReapplyNotice latest={latestRejection} attempt={previousRejections.length + 1} />
        ) : null}
        {review.memo && !rejecting ? (
          <div className={closed ? "opacity-50" : undefined}>
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
