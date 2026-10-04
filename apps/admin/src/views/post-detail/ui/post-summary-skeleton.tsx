import { Card, Grid, HStack, Skeleton } from "@roll-and-call/ui";

import { FactRows } from "@/shared/ui";

const valueOf = (label: string) => ({
  label,
  value: <Skeleton width={120} height={14} render={<span />} className="inline-block" />,
});

const LEFT_LABELS = ["세션 일정", "플레이타임", "룰"];
const RIGHT_LABELS = ["모집 마감일", "GM"];

export function PostSummarySkeleton() {
  return (
    <Card.Root
      padding="none"
      render={<HStack align="center" gap="150" />}
      className="shrink-0 px-200 py-175"
    >
      <Skeleton width={96} height={64} rounded={400} />
      <Grid className="min-w-0 flex-1 grid-cols-2 items-start gap-x-400">
        <FactRows items={LEFT_LABELS.map(valueOf)} />
        <FactRows items={RIGHT_LABELS.map(valueOf)} />
      </Grid>
      <Skeleton width={32} height={32} rounded={400} />
    </Card.Root>
  );
}
