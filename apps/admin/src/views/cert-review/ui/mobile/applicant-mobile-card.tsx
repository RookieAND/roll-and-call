import { HStack, Text } from "@roll-and-call/ui";

import type { CertReview } from "@/entities/cert/server";
import { appliedRulebookLabel } from "@/entities/rulebook";
import { formatDate } from "@/shared/lib";
import { KeyValueList, Tag, UserInitial, type KeyValueItem } from "@/shared/ui";

const LONG_WAIT_DAYS = 5;

interface ApplicantMobileCardProps {
  review: CertReview;
}

// 신청자 요약과 신청 메모·퀴즈를 라벨 위·값 아래로 쌓는다.
export function ApplicantMobileCard({ review }: ApplicantMobileCardProps) {
  const { applicant, quiz } = review;
  const items: KeyValueItem[] = [
    {
      label: "신청 룰북",
      value: appliedRulebookLabel({
        rulebook: review.rulebook,
        groupBookCount: review.groupBooks.length,
      }),
    },
    { label: "디스코드 ID", value: `@${applicant.discordHandle}` },
    { label: "신청 일자", value: formatDate(review.appliedAt) },
    {
      label: "대기",
      value: (
        <Text
          typography="body3"
          weight="medium"
          foreground={review.waitedDays >= LONG_WAIT_DAYS ? "danger" : "normal"}
        >
          {review.waitedDays}일째
        </Text>
      ),
    },
    ...(review.memo ? [{ label: "신청 메모", value: review.memo }] : []),
    ...(quiz
      ? [
          {
            label: "퀴즈",
            value: (
              <>
                {`${quiz.question} → `}
                <Text typography="body3" weight="bold" render={<b />}>
                  {quiz.answer}
                </Text>
              </>
            ),
          },
        ]
      : []),
  ];
  return (
    <section className="rounded-600 border border-gray-200 bg-surface">
      <HStack align="center" gap="125" className="px-175 py-150">
        <UserInitial nickname={applicant.nickname} />
        <Text typography="heading3" render={<h2 />} className="min-w-0 truncate">
          {applicant.nickname}
        </Text>
        {review.previousRejectionCount > 0 ? <Tag tone="warning">재신청</Tag> : null}
        {review.format === "ebook" ? <Tag>전자책</Tag> : null}
      </HStack>
      <div className="border-t border-(--rc-color-border-subtle) px-175">
        <KeyValueList items={items} />
      </div>
    </section>
  );
}
