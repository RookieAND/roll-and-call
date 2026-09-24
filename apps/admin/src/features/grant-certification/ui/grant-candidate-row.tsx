import { Badge, Button, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

import { formatDate, formatMonthDay } from "@/shared/lib";
import type { GrantCandidate } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

interface GrantCandidateRowProps {
  candidate: GrantCandidate;
  selected: boolean;
  onSelect: () => void;
}

const metaOf = (candidate: GrantCandidate) => {
  if (candidate.state === "certified" && candidate.approvedAt) {
    return `${formatDate(candidate.approvedAt)} 인증`;
  }
  if (candidate.state === "pending" && candidate.appliedAt) {
    return `${formatMonthDay(candidate.appliedAt)}에 신청한 심사가 대기 중입니다`;
  }
  const sessions = `최근 90일 세션 ${candidate.recentSessionCount}회`;
  return candidate.hasApplied ? sessions : `신청 기록이 없습니다 · ${sessions}`;
};

export function GrantCandidateRow({ candidate, selected, onSelect }: GrantCandidateRowProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className={cn(
        "border-t border-(--rc-color-border-subtle) px-150 py-125 first:border-t-0",
        selected && "bg-tinted-bg",
      )}
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" weight="medium" truncate>
          {candidate.nickname}
        </Text>
        <Text typography="body4" foreground="hint" truncate>
          {metaOf(candidate)}
        </Text>
      </VStack>
      {candidate.state === "certified" ? (
        <Badge colorPalette="success">이미 인증됨</Badge>
      ) : selected ? (
        <IconBadge icon={CircleCheck} colorPalette="primary">
          선택됨
        </IconBadge>
      ) : (
        <Button variant="outline" colorPalette="gray" size="sm" onClick={onSelect}>
          선택
        </Button>
      )}
    </HStack>
  );
}
