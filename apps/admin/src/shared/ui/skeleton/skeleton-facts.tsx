import { Grid, Skeleton, Text, VStack } from "@roll-and-call/ui";

const COLUMNS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" } as const;

interface SkeletonFactsProps {
  labels: string[];
  columns?: keyof typeof COLUMNS;
}

// 사실 격자의 라벨은 그대로 두고 값만 뼈대로 둔다.
export function SkeletonFacts({ labels, columns = 4 }: SkeletonFactsProps) {
  return (
    <Grid render={<dl />} className={`${COLUMNS[columns]} gap-x-200 gap-y-150`}>
      {labels.map((label, index) => (
        <VStack key={label} gap="050" className="min-w-0">
          <Text typography="body4" foreground="hint" truncate render={<dt />}>
            {label}
          </Text>
          <Skeleton width={index % 2 ? 72 : 96} height={16} render={<dd />} />
        </VStack>
      ))}
    </Grid>
  );
}
