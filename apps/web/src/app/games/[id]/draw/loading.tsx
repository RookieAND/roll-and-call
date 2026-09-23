import { Card, Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

const CONFIRMED_ROW_COUNT = 3;
const WAITING_ROW_COUNT = 2;
const QUEUES = [
  { key: "confirmed", rows: CONFIRMED_ROW_COUNT },
  { key: "waiting", rows: WAITING_ROW_COUNT },
] as const;

// 결과 페이지(DrawSummary · DrawQueue 두 통)와 같은 치수. 숫자 굴림이 시작되기 전 자리를 잡아 둔다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="추첨 결과" />
      <Container size="sm" className="py-200">
        <VStack gap="250">
          <VStack gap="150">
            <HStack align="center" gap="100">
              <Skeleton height={22} className="min-w-0 flex-1" />
              <Skeleton width={54} height={24} rounded={300} />
              <Skeleton width={40} height={40} rounded={500} />
            </HStack>
            <Grid cols={2} gap="100">
              <Skeleton height={70} rounded={500} />
              <Skeleton height={70} rounded={500} />
            </Grid>
          </VStack>
          {QUEUES.map((queue) => (
            <VStack key={queue.key} gap="100">
              <Skeleton width={72} height={18} />
              <Card.Root radius={500} background="none" padding="none" className="overflow-hidden">
                {Array.from({ length: queue.rows }).map((_, index) => (
                  <HStack
                    key={index}
                    align="center"
                    gap="125"
                    className="min-h-[60px] border-gray-200 px-175 py-100 not-first:border-t"
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
    </>
  );
}
