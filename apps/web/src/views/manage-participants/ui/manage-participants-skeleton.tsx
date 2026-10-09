"use client";

import { Card, Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

const QUEUES = [
  { key: "confirmed", rows: 3 },
  { key: "waiting", rows: 2 },
] as const;

export function ManageParticipantsSkeleton() {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <AppBar back={`/games/${id}/manage`} title="참여자 관리" />
      <Container size="md">
        <VStack gap="250" className="py-200" aria-busy>
          <VStack gap="150">
            <HStack align="center" gap="075">
              <Skeleton height={28} className="min-w-0 flex-1" />
              <Skeleton width={56} height={21} rounded={300} />
              <Skeleton width={64} height={21} rounded={300} />
            </HStack>
            <Grid cols={2} gap="100">
              <Skeleton height={73} rounded={500} />
              <Skeleton height={73} rounded={500} />
            </Grid>
            <Skeleton height={45} rounded={500} />
          </VStack>

          {QUEUES.map((queue) => (
            <VStack key={queue.key} gap="125">
              <HStack align="center" gap="075" className="min-h-8">
                <Skeleton width={56} height={21} />
                <Skeleton width={40} height={21} />
                <span className="flex-1" />
                <Skeleton width={72} height={32} rounded={400} />
              </HStack>
              <Card.Root
                radius={500}
                padding="none"
                className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
              >
                {range(queue.rows).map((index) => (
                  <HStack
                    key={index}
                    align="center"
                    gap="125"
                    className="min-h-15 py-100 pr-075 pl-175"
                  >
                    <Skeleton width={32} height={32} rounded="full" />
                    <VStack gap="025" className="min-w-0 flex-1">
                      <Skeleton width={96} height={17} />
                      <Skeleton width="50%" height={14} />
                    </VStack>
                    <Skeleton width={32} height={32} rounded={400} />
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
