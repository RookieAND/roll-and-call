import { Button } from "@roll-and-call/ui";
import { Quote } from "lucide-react";
import Link from "next/link";

import { CertDecisionForm } from "@/features/decide-cert";
import { formatDateTime } from "@/shared/lib";
import type { CertReview } from "@/shared/server";
import { AdminHeader, ConflictNotice, ItemCard } from "@/shared/ui";

import { ApplicantCard } from "./applicant-card";
import { ReapplyNotice } from "./reapply-notice";

const DECISION_LABEL = { approved: "승인", rejected: "반려" } as const;

interface CertReviewViewProps {
  review: CertReview;
  viewer: string;
  rejecting: boolean;
}

export function CertReviewView({ review, viewer, rejecting }: CertReviewViewProps) {
  const { applicant, previousRejections, processed } = review;
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
        photoUrls={review.photoUrls}
        replacedShots={review.replacedShots}
        nextId={review.nextId}
        compact={reapplied || Boolean(processed)}
        disabled={Boolean(processed)}
      >
        <ApplicantCard review={review} />
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
      </CertDecisionForm>
    </>
  );
}
