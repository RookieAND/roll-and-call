import { Card, HStack, Skeleton } from "@roll-and-call/ui";

import { FactRows } from "@/shared/ui";

const valueOf = (label: string) => ({
  label,
  value: <Skeleton width={120} height={14} render={<span />} className="inline-block" />,
});

const LABELS = ["세션 일정", "모집 마감일", "플레이타임", "GM"];

export function PostSummarySkeleton() {
  return (
    <Card.Root
      padding="none"
      render={<HStack align="center" gap="150" />}
      className="shrink-0 px-200 py-175"
    >
      <div className="min-w-0 flex-1">
        <FactRows items={LABELS.map(valueOf)} />
      </div>
      <Skeleton width={32} height={32} rounded={400} />
    </Card.Root>
  );
}
