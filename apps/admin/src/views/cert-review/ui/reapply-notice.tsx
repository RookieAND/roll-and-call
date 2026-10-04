import { CERT_SHOT_LABEL } from "@roll-and-call/database/certifications/model";
import { HStack, Text, VStack } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { formatDate } from "@/shared/lib";
import type { PreviousRejection } from "@/shared/server";
import { FactRows, IconTile, Tag } from "@/shared/ui";

import { RejectedRequests } from "./rejected-requests";

interface ReapplyNoticeProps {
  latest: PreviousRejection;
  attempt: number;
}

export function ReapplyNotice({ latest, attempt }: ReapplyNoticeProps) {
  return (
    <VStack
      render={<section aria-label="재신청 안내" />}
      className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
    >
      <HStack
        align="center"
        gap="100"
        className="border-b border-(--rc-color-border-subtle) px-200 py-150"
      >
        <IconTile icon={RotateCcw} tone="primary" />
        <Text typography="heading3" render={<h2 />}>
          {attempt}번째 신청
        </Text>
        <Text typography="body4" foreground="hint">
          이전 신청은 {formatDate(latest.rejectedAt)}에 반려되었습니다
        </Text>
      </HStack>
      <div className="px-200 py-100">
        <FactRows
          labelWidth={140}
          items={[
            {
              label: "지난번 반려 사유",
              value: latest.tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
            },
            {
              label: "문제로 지정한 사진",
              value: latest.flaggedShots.length ? (
                latest.flaggedShots.map((shot) => (
                  <Tag key={shot} tone="danger">
                    {CERT_SHOT_LABEL[shot]}
                  </Tag>
                ))
              ) : (
                <Text typography="body3" foreground="hint">
                  없음
                </Text>
              ),
            },
            {
              label: "사용자에게 보인 사유",
              value: <RejectedRequests requests={latest.requests} />,
            },
          ]}
        />
      </div>
    </VStack>
  );
}
