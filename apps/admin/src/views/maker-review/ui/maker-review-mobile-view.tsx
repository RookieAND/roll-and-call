import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";
import { VStack } from "@roll-and-call/ui";

import type { HomebrewReview } from "@/entities/homebrew/server";
import { MobileHomebrewDecision } from "@/features/decide-homebrew";
import { formatFullDateTime } from "@/shared/lib";
import { AdminHeader, KeyValueList, MobileSection } from "@/shared/ui";

import { ApplicantLink } from "./applicant-link";
import { NameConflictCallout } from "./name-conflict-callout";
import { ReviewMaterial } from "./review-material";
import { WithdrawnNotice } from "./withdrawn-notice";

interface MakerReviewMobileViewProps {
  review: HomebrewReview;
}

export function MakerReviewMobileView({ review }: MakerReviewMobileViewProps) {
  const { application } = review;
  const nextHref = review.nextPendingId ? `/cert/maker/${review.nextPendingId}` : undefined;
  const label = rulebookLabel(application);
  return (
    <>
      <AdminHeader title={application.name} trail={[{ href: "/cert/maker", label: "자작 룰" }]} />
      <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
        {review.nameConflict ? <NameConflictCallout /> : null}
        {application.status === "withdrawn" && application.processedAt ? (
          <WithdrawnNotice withdrawnAt={application.processedAt} nextHref={nextHref} />
        ) : null}
        <MobileSection title="신청 정보">
          <KeyValueList
            items={[
              {
                label: "신청자",
                value: (
                  <ApplicantLink
                    userId={application.userId}
                    nickname={review.applicantNickname}
                    avatarUrl={review.applicantAvatarUrl}
                  />
                ),
              },
              { label: "신청 일시", value: formatFullDateTime(application.createdAt) },
              { label: "룰 이름", value: label },
              { label: "소개", value: application.summary, stack: true },
            ]}
          />
        </MobileSection>
        <MobileSection title="심사 자료">
          <ReviewMaterial
            description={application.description}
            links={application.links}
            images={review.images}
            ruleName={application.name}
          />
        </MobileSection>
      </VStack>
      <MobileHomebrewDecision
        applicationId={application.id}
        name={application.name}
        ruleLabel={label}
        decidable={application.status === "pending"}
        nameConflict={review.nameConflict}
      />
    </>
  );
}
