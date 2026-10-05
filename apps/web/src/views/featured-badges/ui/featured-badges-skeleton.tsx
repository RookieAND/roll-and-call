import { Grid, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function FeaturedBadgesSkeleton() {
  return (
    <>
      <AppBar back="/me/badges" title="대표 뱃지 설정" />
      <VStack gap="200" aria-busy className="px-200 pt-225 pb-300">
        <Skeleton width="100%" height={64} rounded={500} />
        <Grid cols={4} gap="100">
          {range(8).map((index) => (
            <VStack key={index} align="center" gap="100" className="pt-150 pb-125">
              <Skeleton width={48} height={48} rounded="full" />
              <Skeleton width={40} height={12} />
            </VStack>
          ))}
        </Grid>
      </VStack>
    </>
  );
}
