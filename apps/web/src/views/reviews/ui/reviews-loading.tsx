"use client";

import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

import { ReviewListSkeleton } from "./review-list-skeleton";

interface ReviewsLoadingProps {
  backBase: "/users" | "/games";
  title: string;
  heading?: boolean;
}

export function ReviewsLoading({ backBase, title, heading = false }: ReviewsLoadingProps) {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <AppBar back={`${backBase}/${id}`} title={title} />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          {heading && (
            <VStack gap="050">
              <HStack align="center" gap="075">
                <Skeleton height={27} className="min-w-0 flex-1" />
                <Skeleton width={48} height={24} rounded={300} />
              </HStack>
              <Skeleton width={160} height={15} />
            </VStack>
          )}
          <ReviewListSkeleton />
        </VStack>
      </Container>
    </>
  );
}
