import { Badge, Grid, HStack, Text } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { CertReview } from "@/shared/server";
import { FactRows, UserInitial } from "@/shared/ui";

const LONG_WAIT_DAYS = 5;

interface ApplicantCardProps {
  review: CertReview;
}

export function ApplicantCard({ review }: ApplicantCardProps) {
  const { applicant, previousRejections } = review;
  const latestRejection = previousRejections.at(-1);
  const waitForeground = review.waitedDays >= LONG_WAIT_DAYS ? "danger" : "normal";
  return (
    <section className="rounded-600 border border-gray-200 bg-surface">
      <HStack align="center" gap="150" className="px-200 py-175">
        <UserInitial nickname={applicant.nickname} />
        <HStack align="center" gap="100" wrap className="min-w-0 flex-1">
          <Text typography="heading3" render={<h2 />}>
            {applicant.nickname}
          </Text>
          {latestRejection ? <Badge colorPalette="warning">재신청</Badge> : null}
          {review.format === "ebook" ? <Badge colorPalette="primary">전자책</Badge> : null}
        </HStack>
      </HStack>
      <Grid className="grid-cols-2 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
        <FactRows
          labelWidth={72}
          items={[
            { label: "신청 룰북", value: review.rulebook },
            { label: "디스코드 ID", value: `@${applicant.discordHandle}` },
          ]}
        />
        <FactRows
          labelWidth={72}
          items={[
            { label: "신청 일자", value: formatDate(review.appliedAt) },
            {
              label: "대기",
              value: (
                <Text typography="body3" weight="medium" foreground={waitForeground}>
                  {review.waitedDays}일째
                </Text>
              ),
            },
          ]}
        />
      </Grid>
    </section>
  );
}
