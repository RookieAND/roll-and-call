import { Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

const DATE_ROW_COUNT = 2;

export function RulebookCertSkeleton() {
  return (
    <>
      <AppBar back="/me/rulebooks" title="신청 상세" />
      <Container size="sm" className="px-0">
        <VStack
          aria-busy
          className="min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-3px)]"
        >
          <VStack gap="100" className="px-200 py-250">
            <HStack align="start" gap="125">
              <Skeleton width={160} height={26} className="min-w-0 flex-1" />
              <HStack align="center" gap="075" className="flex-none pt-025">
                <Skeleton width={48} height={22} rounded="full" />
                <Skeleton width={48} height={22} rounded="full" />
              </HStack>
            </HStack>
            <Skeleton width={120} height={21} />
            <Grid className="grid-cols-[auto_1fr] gap-x-150 gap-y-025">
              {range(DATE_ROW_COUNT).flatMap((index) => [
                <Skeleton key={`label-${index}`} width={48} height={21} />,
                <Skeleton key={`value-${index}`} width={110} height={21} />,
              ])}
            </Grid>
          </VStack>
          <VStack>
            <div aria-hidden className="h-100 bg-canvas" />
            <VStack gap="100" className="px-200 py-225">
              <Skeleton width={64} height={21} />
              <HStack gap="100">
                {range(3).map((index) => (
                  <Skeleton key={index} width="100%" height={96} rounded={300} />
                ))}
              </HStack>
            </VStack>
          </VStack>
          <VStack className="flex-1" />
          <VStack className="sticky bottom-(--rc-size-tabbar) z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-200 pt-150 pb-200">
            <Skeleton width="100%" height={48} rounded={500} />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
