import { CERT_SHOT_LABEL } from "@roll-and-call/database/certifications/model";
import { HStack, Text, VStack } from "@roll-and-call/ui";

import { formatFullDate } from "@/shared/lib";
import type { PreviousRejection } from "@/shared/server";
import { KeyValueList, Tag } from "@/shared/ui";

interface ReapplyMobileCardProps {
  latest: PreviousRejection;
  attempt: number;
}

export function ReapplyMobileCard({ latest, attempt }: ReapplyMobileCardProps) {
  return (
    <VStack
      render={<section aria-label="재신청 안내" />}
      className="rounded-600 border border-gray-200 bg-surface"
    >
      <VStack gap="025" className="border-b border-(--rc-color-border-subtle) px-175 py-150">
        <Text typography="heading3" render={<h2 />}>
          {attempt}번째 신청
        </Text>
        <Text typography="body4" foreground="hint">
          이전 신청은 {formatFullDate(latest.rejectedAt)}에 반려되었습니다
        </Text>
      </VStack>
      <div className="px-175">
        <KeyValueList
          items={[
            {
              label: "지난번 반려 사유",
              value: (
                <HStack gap="050" wrap render={<span />}>
                  {latest.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </HStack>
              ),
            },
            {
              label: "문제로 지정한 사진",
              value: latest.flaggedShots.length ? (
                <HStack gap="050" wrap render={<span />}>
                  {latest.flaggedShots.map((shot) => (
                    <Tag key={shot} tone="danger">
                      {CERT_SHOT_LABEL[shot]}
                    </Tag>
                  ))}
                </HStack>
              ) : (
                "없음"
              ),
            },
            {
              label: "사용자에게 보인 사유",
              value: (
                <VStack gap="050" render={<span />}>
                  {latest.requests.map((request) => (
                    <span key={request}>{request}</span>
                  ))}
                </VStack>
              ),
            },
          ]}
        />
      </div>
    </VStack>
  );
}
