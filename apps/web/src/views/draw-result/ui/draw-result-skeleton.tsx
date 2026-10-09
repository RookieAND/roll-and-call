import { Card, Container, FloatingBar, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { DrawResultAppBar } from "./draw-result-app-bar";

const CONFIRMED_ROW_COUNT = 3;
const WAITING_ROW_COUNT = 2;
const QUEUES = [
  { key: "confirmed", rows: CONFIRMED_ROW_COUNT },
  { key: "waiting", rows: WAITING_ROW_COUNT },
] as const;

export function DrawResultSkeleton() {
  return (
    <>
      <DrawResultAppBar />
      <Container size="sm" className="py-200">
        <VStack gap="250" aria-busy>
          <VStack gap="150">
            <HStack align="center" gap="100">
              <Skeleton height={22} className="min-w-0 flex-1" />
              <Skeleton width={54} height={24} rounded={300} />
              <Skeleton width={44} height={44} rounded={500} />
            </HStack>
            <Grid cols={2} gap="100">
              <Skeleton height={70} rounded={500} />
              <Skeleton height={70} rounded={500} />
            </Grid>
            <Skeleton height={48} rounded={500} />
          </VStack>
          {QUEUES.map((queue) => (
            <VStack key={queue.key} gap="100">
              <Skeleton width={72} height={18} />
              <Card.Root radius={500} background="none" padding="none" className="overflow-hidden">
                {range(queue.rows).map((index) => (
                  <HStack
                    key={index}
                    align="center"
                    gap="125"
                    className="min-h-14 border-gray-200 px-175 py-100 not-first:border-t"
                  >
                    <Skeleton width={32} height={32} rounded="full" />
                    <VStack gap="050" className="min-w-0 flex-1">
                      <Skeleton width={72} height={16} />
                      <Skeleton width="60%" height={14} />
                    </VStack>
                    <Skeleton width={32} height={26} />
                  </HStack>
                ))}
              </Card.Root>
            </VStack>
          ))}
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Spacer />
        <FloatingBar.Content aria-busy>
          <Skeleton height={48} rounded={500} />
        </FloatingBar.Content>
      </FloatingBar.Root>
    </>
  );
}
