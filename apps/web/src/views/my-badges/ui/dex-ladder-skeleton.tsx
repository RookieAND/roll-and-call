import { Grid, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

export function DexLadderSkeleton() {
  return (
    <Grid cols={5}>
      {range(5).map((index) => (
        <VStack key={index} align="center" gap="075">
          <Skeleton width={52} height={52} rounded="full" />
          <Skeleton width={36} height={12} />
          <Skeleton width={24} height={10} />
        </VStack>
      ))}
    </Grid>
  );
}
