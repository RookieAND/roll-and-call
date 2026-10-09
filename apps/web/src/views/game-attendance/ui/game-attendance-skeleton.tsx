"use client";

import { Card, Container, FloatingBar, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

const ROW_COUNT = 4;
const ROW_NAME_WIDTHS = [56, 48, 60, 52];

export function GameAttendanceSkeleton() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AppBar back={`/games/${id}/manage`} title="출석 확인" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          <HStack align="center" gap="100">
            <Skeleton height={28} className="min-w-0 flex-1" />
            <Skeleton width={56} height={21} rounded={300} className="flex-none" />
            <Skeleton width={64} height={21} rounded={300} className="flex-none" />
          </HStack>
          <VStack gap="200">
            <VStack gap="100">
              <Grid cols={2} gap="100">
                <Skeleton height={68} rounded={500} />
                <Skeleton height={68} rounded={500} />
              </Grid>
              <Skeleton width="100%" height={48} rounded={500} />
              <Skeleton width="100%" height={90} rounded={500} />
            </VStack>
            <Card.Root
              radius={500}
              padding="none"
              className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
            >
              {range(ROW_COUNT).map((index) => (
                <HStack key={index} align="center" gap="125" className="min-h-16 px-150 py-125">
                  <Skeleton width={40} height={40} rounded="full" className="flex-none" />
                  <VStack gap="025" className="min-w-0 flex-1">
                    <Skeleton width={ROW_NAME_WIDTHS[index]} height={20} />
                    <Skeleton width={96} height={16} />
                  </VStack>
                  <Skeleton width={128} height={32} rounded={400} className="flex-none" />
                </HStack>
              ))}
            </Card.Root>
          </VStack>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Skeleton width="100%" height={48} rounded={500} />
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
