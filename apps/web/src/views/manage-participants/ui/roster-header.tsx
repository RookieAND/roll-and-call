import { Badge, HStack, Text, VStack, cn } from "@trpg/ui";

import type { RosterSummary } from "../model/roster-summary";

// "신청(확정+대기 합)"을 정원 옆에 두면 잘못 읽히므로 확정만 정원과 나란히 둔다.
export function RosterHeader({
  title,
  confirmedCount,
  waitingCount,
  maxPlayers,
  summary,
  locked,
}: {
  title: string;
  confirmedCount: number;
  waitingCount: number;
  maxPlayers: number;
  summary: RosterSummary;
  locked: boolean;
}) {
  const deadlineClass = cn("font-semibold", summary.deadlineWarn && "text-warning-600");
  const note = locked
    ? "세션이 확정되어 명단을 바꿀 수 없습니다."
    : "기한이 지나도 명단은 계속 고칠 수 있습니다.";

  return (
    <VStack gap={2}>
      <Text typography="subtitle1" foreground="muted" render={<h1 />} className="truncate">
        {title}
      </Text>
      <HStack align="center" gap={2}>
        <Text typography="heading1" className="tabular-nums">
          확정 {confirmedCount}/{maxPlayers}
        </Text>
        {waitingCount > 0 && <Badge color="gray">대기 {waitingCount}명</Badge>}
      </HStack>
      <Text typography="body3" foreground="muted" render={<p />}>
        모집 마감 <span className="font-semibold text-gray-900">{summary.deadlineAt}</span>{" "}
        <span className={deadlineClass}>{summary.deadlineLabel}</span>
      </Text>
      <Text typography="body4" foreground="hint" render={<p />}>
        {note}
      </Text>
    </VStack>
  );
}
