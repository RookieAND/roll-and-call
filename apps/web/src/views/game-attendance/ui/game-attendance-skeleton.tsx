import { Card, Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

const ROW_COUNT = 4;
const ROW_NAME_WIDTHS = [56, 48, 60, 52];

export function GameAttendanceSkeleton() {
  return (
    <>
      <AppBar back="/games" title="출석 확인" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          <HStack align="center" gap="075">
            <Skeleton width={120} height={22} className="flex-1" />
            <Skeleton width={80} height={26} rounded={300} />
            <Skeleton width={60} height={26} rounded={300} />
          </HStack>
          <Grid cols={2} gap="100">
            <Skeleton height={68} rounded={500} />
            <Skeleton height={68} rounded={500} />
          </Grid>
          <Skeleton width="100%" height={48} rounded={500} />
          <Card.Root
            radius={500}
            padding="none"
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
          >
            {range(ROW_COUNT).map((index) => (
              <HStack key={index} align="center" gap="125" className="min-h-16 px-150 py-125">
                <Skeleton width={32} height={32} rounded="full" />
                <VStack className="flex-1">
                  <Skeleton width={ROW_NAME_WIDTHS[index]} height={15} />
                </VStack>
                <Skeleton width={138} height={52} rounded={400} />
              </HStack>
            ))}
          </Card.Root>
        </VStack>
      </Container>
    </>
  );
}
