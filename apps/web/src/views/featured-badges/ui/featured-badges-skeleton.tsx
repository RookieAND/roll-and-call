import { Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function FeaturedBadgesSkeleton() {
  return (
    <>
      <AppBar back="/me/badges" title="대표 뱃지 설정" />
      <Container
        size="sm"
        className="flex min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-3px)] flex-col px-0"
      >
        <VStack gap="200" aria-busy className="p-200">
          <Skeleton width={80} height={24} />
          <Skeleton width="100%" height={88} rounded={500} />
          <Grid cols={3} gap="100">
            {range(3).map((index) => (
              <Skeleton key={index} width="100%" height={128} rounded={500} />
            ))}
          </Grid>
        </VStack>
        <div className="border-t-8 border-gray-50" />
        <HStack gap="100" className="px-200 py-150">
          {range(3).map((index) => (
            <Skeleton key={index} width="100%" height={20} />
          ))}
        </HStack>
        <VStack gap="125" className="px-200 pt-200 pb-250">
          {range(3).map((index) => (
            <Skeleton key={index} width="100%" height={72} rounded={500} />
          ))}
        </VStack>
        <div className="sticky bottom-(--rc-size-tabbar) z-(--rc-z-sticky) mt-auto border-t border-gray-100 bg-surface px-200 py-150">
          <Skeleton width="100%" height={48} rounded={500} />
        </div>
      </Container>
    </>
  );
}
