import { Badge } from "@trpg/ui";

// 추첨은 선착순과 접수 규칙이 달라 눈에 띄어야 한다.
export function LotteryMethodBadge({ label }: { label: string }) {
  return (
    <Badge color="primary" className="shrink-0">
      {label}
    </Badge>
  );
}
