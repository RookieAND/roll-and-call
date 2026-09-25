import { Grid, HStack, Skeleton } from "@roll-and-call/ui";

import { FactRows } from "@/shared/ui";

const valueOf = (label: string) => ({
  label,
  value: <Skeleton width={120} height={14} render={<span />} className="inline-block" />,
});

// PostSummary의 뼈대. 라벨은 그리고 제목·상태·값만 비운다.
export function PostSummarySkeleton() {
  return (
    <section className="shrink-0 rounded-600 border border-gray-200 bg-surface">
      <HStack align="center" gap="150" className="px-200 py-175">
        <Skeleton width={96} height={64} rounded={400} />
        <HStack align="center" gap="100" className="min-w-0 flex-1">
          <Skeleton width={160} height={20} />
          <Skeleton width={52} height={20} rounded={300} />
        </HStack>
        <Skeleton width={32} height={32} rounded={400} />
      </HStack>
      <Grid className="grid-cols-2 items-start gap-x-400 border-t border-(--rc-color-border-subtle) px-200 py-100">
        <FactRows items={["세션 일정", "플레이타임", "룰"].map(valueOf)} />
        <FactRows items={["모집 마감일", "GM"].map(valueOf)} />
      </Grid>
    </section>
  );
}
