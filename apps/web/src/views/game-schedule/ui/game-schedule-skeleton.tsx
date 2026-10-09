"use client";

import { Container, FloatingBar, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

export function GameScheduleSkeleton() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AppBar
        back={`/games/${id}`}
        title="일정 조율"
        action={<Skeleton width={32} height={21} rounded={300} />}
      />
      <Container>
        <VStack gap="150" className="pt-175 pb-200">
          <HStack align="center" gap="050">
            <Skeleton width={44} height={44} rounded={400} />
            <Skeleton height={20} className="flex-1" />
            <Skeleton width={44} height={44} rounded={400} />
          </HStack>
          <VStack gap="150">
            <Skeleton width="100%" height={44} rounded={400} />
            <VStack gap="150">
              <Skeleton width="80%" height={16} />
              <Skeleton width="100%" height={250} rounded={500} />
              <HStack gap="175">
                <Skeleton width={48} height={16} />
                <Skeleton width={56} height={16} />
                <Skeleton width={96} height={16} />
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <HStack justify="center" className="mb-100">
            <Skeleton width={120} height={20} />
          </HStack>
          <HStack gap="100" className="[&>*]:flex-1">
            <Skeleton height={48} rounded={500} />
            <Skeleton height={48} rounded={500} />
          </HStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
