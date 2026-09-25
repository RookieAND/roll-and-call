import { Button, Callout } from "@roll-and-call/ui";
import { Quote, Receipt } from "lucide-react";
import Link from "next/link";

import { CertDecisionForm } from "@/features/decide-cert";
import { formatDate, formatDateTime } from "@/shared/lib";
import type { CertReview } from "@/shared/server";
import { AdminHeader, ConflictNotice, ItemCard } from "@/shared/ui";

import { ApplicantCard } from "./applicant-card";
import { EbookInputPanel } from "./ebook-input-panel";
import { ReapplyNotice } from "./reapply-notice";

const DECISION_LABEL = { approved: "승인", rejected: "반려" } as const;
const DUPLICATE_STATUS_LABEL = {
  pending: "심사 대기",
  approved: "인증됨",
  rejected: "반려",
} as const;

interface CertReviewViewProps {
  review: CertReview;
  viewer: string;
  rejecting: boolean;
}

export function CertReviewView({ review, viewer, rejecting }: CertReviewViewProps) {
  const { applicant, previousRejections, processed, purchase } = review;
  const purchaseLine = [purchase.orderNumber, purchase.orderDate].filter(Boolean).join(" · ");
  const ebook = review.format === "ebook";
  const photoUrls = ebook
    ? { order: purchase.captureUrl, receipt: purchase.receiptUrl }
    : review.photoUrls;
  const waitingOn = review.blockers?.waitingOn ?? [];
  const duplicate = review.blockers?.duplicate ?? null;
  const latestRejection = previousRejections.at(-1);
  const reapplied = Boolean(latestRejection);
  const nextHref = review.nextId ? `/cert/${review.nextId}` : "/cert";
  const conflictTitle = processed
    ? processed.by === viewer
      ? `이미 ${DECISION_LABEL[processed.status]}한 신청입니다`
      : `다른 운영진(${processed.by})이 이미 ${DECISION_LABEL[processed.status]}했습니다`
    : "";

  return (
    <>
      <AdminHeader
        title="룰북 인증 심사"
        back={{ href: "/cert", label: "심사 대기열" }}
        sub={review.position ? `${review.position.index} / ${review.position.total}` : undefined}
      />
      <CertDecisionForm
        applicationId={review.id}
        applicantLabel={`${applicant.nickname} · ${review.rulebook}`}
        format={review.format}
        photoUrls={photoUrls}
        replacedShots={review.replacedShots}
        approveBlockedNote={duplicate ? "주문번호가 겹쳐 승인할 수 없습니다" : undefined}
        nextId={review.nextId}
        compact={reapplied || Boolean(processed) || waitingOn.length > 0}
        disabled={Boolean(processed) || waitingOn.length > 0}
      >
        <ApplicantCard review={review} />
        {waitingOn.length > 0 ? (
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Description>
              같은 판본의 기본 룰북({waitingOn.join(", ")})이 아직 결정되지 않아 이 서플리먼트는
              심사할 수 없습니다. 기본 룰북이 반려되면 이 책은 자동으로 반려됩니다.
            </Callout.Description>
          </Callout.Root>
        ) : null}
        {duplicate ? (
          <Callout.Root colorPalette="danger">
            <Callout.Icon />
            <Callout.Description>
              이미 다른 사용자의 신청에 쓰인 주문번호입니다. {duplicate.nickname} 님의{" "}
              {DUPLICATE_STATUS_LABEL[duplicate.status]} 기록({formatDate(duplicate.at)})과
              판매처·주문번호가 같습니다.
            </Callout.Description>
          </Callout.Root>
        ) : null}
        {processed ? (
          <ConflictNotice
            title={conflictTitle}
            description={`${formatDateTime(processed.at)}에 처리됐습니다. 이 신청은 더 이상 심사할 수 없습니다.`}
            actions={
              <>
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={<Link href={`/log?target=${encodeURIComponent(applicant.nickname)}`} />}
                >
                  활동 기록에서 보기
                </Button>
                <Button size="sm" render={<Link href={nextHref} />}>
                  다음 건
                </Button>
              </>
            }
          />
        ) : null}
        {latestRejection && !rejecting && !processed ? (
          <ReapplyNotice
            latest={latestRejection}
            attempt={previousRejections.length + 1}
            replacedShots={review.replacedShots}
          />
        ) : null}
        {review.memo && !rejecting ? (
          <div className={processed ? "opacity-50" : undefined}>
            <ItemCard icon={Quote} tone="primary" title="신청 메모" meta={applicant.nickname}>
              {review.memo}
            </ItemCard>
          </div>
        ) : null}
        {ebook && !rejecting ? (
          <EbookInputPanel purchase={purchase} duplicate={Boolean(duplicate)} />
        ) : null}
        {!ebook && (purchaseLine || purchase.captureUrl) && !rejecting ? (
          <div className={processed ? "opacity-50" : undefined}>
            <ItemCard
              icon={Receipt}
              title="구매 기록"
              meta="선택 입력"
              right={
                purchase.captureUrl ? (
                  <Button
                    variant="outline"
                    colorPalette="gray"
                    size="sm"
                    render={<a href={purchase.captureUrl} target="_blank" rel="noreferrer" />}
                  >
                    캡처 보기
                  </Button>
                ) : null
              }
            >
              {purchaseLine || "주문 번호·주문일 없음"}
            </ItemCard>
          </div>
        ) : null}
      </CertDecisionForm>
    </>
  );
}
