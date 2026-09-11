import { Card, cn, Text } from "@trpg/ui";

// 숫자 하나 + 라벨의 요약 카드. urgent면 빨강 강조(마감 임박 등).
export function StatCard({
  value,
  label,
  urgent,
}: {
  value: number | string;
  label: string;
  urgent?: boolean;
}) {
  return (
    <Card
      padding="none"
      className={cn("flex flex-col px-3.5 py-3.5", urgent && "border-danger-200 bg-danger-50/40")}
    >
      <Text
        render={<div />}
        className={cn(
          "text-2xl leading-none font-extrabold tracking-tight tabular-nums",
          urgent && "text-danger-600",
        )}
      >
        {value}
      </Text>
      <Text typography="body4" foreground="muted" className="mt-1.5 block font-semibold">
        {label}
      </Text>
    </Card>
  );
}
