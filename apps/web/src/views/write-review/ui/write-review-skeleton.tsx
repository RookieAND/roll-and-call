"use client";

import { FloatingBar, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { REVIEW_PHOTO_MAX_COUNT } from "@/entities/review";
import { AppBar } from "@/shared/ui";

export function WriteReviewSkeleton() {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <AppBar back={`/games/${id}`} backIcon="close" title="후기 쓰기" />
      <VStack gap="250" className="p-200" aria-busy>
        <VStack gap="050">
          <HStack align="center" gap="075">
            <Skeleton height={27} className="min-w-0 flex-1" />
            <Skeleton width={48} height={24} rounded={300} />
          </HStack>
          <Skeleton width={160} height={15} />
        </VStack>
        <Skeleton width="100%" height={72} rounded={500} />
        <VStack gap="075">
          <Skeleton width={40} height={20} />
          <Skeleton width="100%" height={130} rounded={400} />
        </VStack>
        <VStack gap="100">
          <HStack align="baseline">
            <Skeleton width={32} height={20} className="flex-1" />
            <Skeleton width={36} height={15} />
          </HStack>
          <Grid cols={3} gap="100">
            {range(REVIEW_PHOTO_MAX_COUNT).map((index) => (
              <Skeleton key={index} className="aspect-square h-auto w-full" rounded={400} />
            ))}
          </Grid>
        </VStack>
        <Skeleton width="100%" height={64} rounded={500} />
      </VStack>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content aria-busy>
          <Skeleton width="100%" height={48} rounded={500} />
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
