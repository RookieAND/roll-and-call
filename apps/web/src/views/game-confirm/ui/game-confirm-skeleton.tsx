"use client";

import { Badge, Container, FloatingBar, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

const CANDIDATE_COUNT = 3;

export function GameConfirmSkeleton() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AppBar
        back={`/games/${id}/manage`}
        title="세션 시간 결정"
        action={<Badge colorPalette="primary">GM</Badge>}
      />
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-200">
          <VStack gap="200">
            <HStack gap="075" align="center">
              <Skeleton height={26} className="min-w-0 flex-1" />
              <Skeleton width={56} height={24} rounded={300} />
              <Skeleton width={120} height={24} rounded={300} />
            </HStack>
            <Grid cols={2} gap="100">
              <Skeleton height={70} rounded={500} />
              <Skeleton height={70} rounded={500} />
            </Grid>
          </VStack>
          <VStack gap="250">
            <VStack gap="125">
              <Skeleton width={64} height={22} />
              <VStack gap="100">
                <VStack gap="075">
                  <Skeleton width={32} height={18} />
                  <Skeleton width="100%" height={44} rounded={400} />
                </VStack>
                <HStack gap="100">
                  <Skeleton height={44} rounded={400} className="flex-1" />
                  <Skeleton height={44} rounded={400} className="flex-1" />
                </HStack>
              </VStack>
              <Skeleton width="70%" height={16} />
              <Skeleton width="100%" height={56} rounded={500} />
            </VStack>
            <VStack gap="125">
              <Skeleton width={96} height={22} />
              <VStack gap="100">
                {range(CANDIDATE_COUNT).map((index) => (
                  <Skeleton key={index} width="100%" height={68} rounded={400} />
                ))}
              </VStack>
            </VStack>
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
