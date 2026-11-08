"use client";

import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { AppBar, PageShell } from "@/shared/ui";

export function SplitTeamsSkeleton() {
  const { id } = useParams<{ id: string }>();
  return (
    <PageShell
      readable
      appBar={<AppBar back={`/games/${id}/participants`} title="팀 나누기" />}
      panel={
        <VStack gap="250" aria-busy>
          <Skeleton height={96} rounded={500} />
          <Skeleton height={104} rounded={500} />
        </VStack>
      }
    >
      <Container size="md" className="desktop:px-0 desktop:max-w-none">
        <VStack gap="250" className="py-200" aria-busy>
          <Skeleton height={80} rounded={500} />
          <HStack justify="between">
            <Skeleton width={72} height={20} />
            <Skeleton width={64} height={20} />
          </HStack>
          <VStack gap="050">
            {range(5).map((row) => (
              <Skeleton key={row} height={52} rounded={500} />
            ))}
          </VStack>
        </VStack>
      </Container>
    </PageShell>
  );
}
