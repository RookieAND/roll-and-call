import { Badge, HStack, Text } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

import { IconBadge } from "@/shared/ui";

interface ShotSectionHeaderProps {
  checkedCount: number;
  total: number;
  rejecting: boolean;
}

export function ShotSectionHeader({ checkedCount, total, rejecting }: ShotSectionHeaderProps) {
  const progressLabel = `확인 ${checkedCount} / ${total}`;
  const allChecked = checkedCount === total;
  // 반려 중에는 사진을 누르면 확대 대신 문제 사진으로 지정된다.
  const guide = rejecting
    ? "문제가 있는 사진을 누르면 반려 사유와 함께 지정됩니다. 크게 보려면 [확대]를 누릅니다."
    : "사진마다 확인 항목을 체크합니다. [확대]를 누르거나 사진을 누르면 크게 볼 수 있습니다.";
  return (
    <HStack align="center" gap="100">
      <Text typography="heading3" render={<h2 id="shot-section-title" />} className="shrink-0">
        사진 확인
      </Text>
      <Text typography="body4" foreground="hint" className="min-w-0">
        {guide}
      </Text>
      <HStack className="ml-auto shrink-0">
        {allChecked ? (
          <IconBadge icon={CircleCheck} colorPalette="success">
            {progressLabel}
          </IconBadge>
        ) : (
          <Badge colorPalette="gray">{progressLabel}</Badge>
        )}
      </HStack>
    </HStack>
  );
}
