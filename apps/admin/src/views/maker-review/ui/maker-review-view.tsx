import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";
import { Grid, Text, VStack } from "@roll-and-call/ui";

import type { HomebrewReview } from "@/entities/homebrew/server";
import { HomebrewDecisionPanel } from "@/features/decide-homebrew";
import { formatFullDateTime } from "@/shared/lib";
import { AdminHeader, FactRows, NextItemButton, Panel } from "@/shared/ui";

import { ApplicantLink } from "./applicant-link";
import { NameConflictCallout } from "./name-conflict-callout";
import { ReviewMaterial } from "./review-material";
import { WithdrawnNotice } from "./withdrawn-notice";

interface MakerReviewViewProps {
  review: HomebrewReview;
}

export function MakerReviewView({ review }: MakerReviewViewProps) {
  const { application } = review;
  const nextHref = review.nextPendingId ? `/cert/maker/${review.nextPendingId}` : undefined;
  const label = rulebookLabel(application);
  return (
    <>
      <AdminHeader
        title={application.name}
        trail={[
          { href: "/cert", label: "룰북 인증" },
          { href: "/cert/maker", label: "자작 룰" },
        ]}
        actions={<NextItemButton href={nextHref} />}
      />
      <Grid className="w-full flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
        <VStack gap="200">
          {review.nameConflict ? <NameConflictCallout /> : null}
          {application.status === "withdrawn" && application.processedAt ? (
            <WithdrawnNotice withdrawnAt={application.processedAt} nextHref={nextHref} />
          ) : null}
          <Panel title="신청 정보" bodyClassName="px-175">
            <FactRows
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
                {
                  label: "룰 이름",
                  value: (
                    <Text typography="body3" weight="bold">
                      {label}
                    </Text>
                  ),
                },
                { label: "소개", value: application.summary },
              ]}
            />
          </Panel>
          <Panel title="심사 자료" bodyClassName="p-175">
            <ReviewMaterial
              description={application.description}
              links={application.links}
              images={review.images}
              ruleName={application.name}
            />
          </Panel>
        </VStack>
        <HomebrewDecisionPanel
          applicationId={application.id}
          name={application.name}
          ruleLabel={label}
          decidable={application.status === "pending"}
          nameConflict={review.nameConflict}
        />
      </Grid>
    </>
  );
}
