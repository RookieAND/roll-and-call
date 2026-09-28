import { Badge, Text } from "@roll-and-call/ui";

interface ReviewStatusBadgeProps {
  openReportCount: number;
  hidden: boolean;
  held: boolean;
}

export function ReviewStatusBadge({ openReportCount, hidden, held }: ReviewStatusBadgeProps) {
  if (openReportCount) return <Badge colorPalette="danger">신고 {openReportCount}건</Badge>;
  if (hidden) return <Badge colorPalette="warning">숨김 중</Badge>;
  if (held) return <Badge colorPalette="gray">보류</Badge>;
  return (
    <Text typography="body3" foreground="hint">
      —
    </Text>
  );
}
