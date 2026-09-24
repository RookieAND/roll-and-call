import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { Check, RotateCcw, X } from "lucide-react";

import { formatDate } from "@/shared/lib";
import type { PreviousRejection } from "@/shared/server";

const SHOT_LABELS = { front: "앞면", back: "뒷면", side: "옆면" } as const;

interface ReapplyNoticeProps {
  latest: PreviousRejection;
  attempt: number;
  replacedShots: (keyof typeof SHOT_LABELS)[];
}

// 재신청 건 위에 지난 반려 사유와 이번에 바뀐 사진을 붙인다.
export function ReapplyNotice({ latest, attempt, replacedShots }: ReapplyNoticeProps) {
  const unchanged = (Object.keys(SHOT_LABELS) as (keyof typeof SHOT_LABELS)[])
    .filter((shot) => !replacedShots.includes(shot))
    .map((shot) => SHOT_LABELS[shot]);
  return (
    <VStack
      render={<section aria-label="재신청 안내" />}
      className="overflow-hidden rounded-600 border border-tinted-border bg-tinted-bg"
    >
      <HStack align="center" gap="100" className="border-b border-tinted-border px-150 py-125">
        <RotateCcw size={14} aria-hidden className="text-tinted-ink" />
        <Text typography="subtitle2" foreground="primary">
          {attempt}번째 신청
        </Text>
        <Text typography="body4" foreground="muted">
          {formatDate(latest.rejectedAt)} 반려
        </Text>
        <HStack gap="075" className="ml-auto">
          {latest.tags.map((tag) => (
            <Badge key={tag} colorPalette="warning">
              {tag}
            </Badge>
          ))}
        </HStack>
      </HStack>
      <VStack gap="100" className="px-150 py-125">
        <VStack gap="050">
          <Text typography="body4" weight="bold" foreground="primary">
            지난번에 요청한 것
          </Text>
          <VStack gap="050" render={<ul />}>
            {latest.requests.map((request) => (
              <Text
                key={request}
                typography="body4"
                render={<li />}
                className="ml-150 list-disc marker:text-tinted-border"
              >
                {request}
              </Text>
            ))}
          </VStack>
        </VStack>
        <HStack align="center" gap="175" className="border-t border-tinted-border pt-100">
          <Text typography="body4" weight="bold" foreground="primary">
            이번에 바뀐 것
          </Text>
          {replacedShots.length ? (
            <HStack align="center" gap="075">
              <Check size={14} aria-hidden />
              <Text typography="body4" weight="medium">
                {replacedShots.map((shot) => SHOT_LABELS[shot]).join("·")} 사진 교체
              </Text>
            </HStack>
          ) : null}
          {unchanged.length ? (
            <HStack align="center" gap="075" className="text-hint">
              <X size={14} aria-hidden />
              <Text typography="body4" foreground="hint">
                {unchanged.join("·")}은 그대로
              </Text>
            </HStack>
          ) : null}
        </HStack>
      </VStack>
    </VStack>
  );
}
