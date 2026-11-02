"use client";

import { Badge, Container, Grid, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { AppBar, PageShell } from "@/shared/ui";

const CANDIDATE_COUNT = 3;

export function GameConfirmSkeleton() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageShell
      readable
      appBar={
        <AppBar
          back={`/games/${id}/manage`}
          title="세션 시간 결정"
          action={<Badge colorPalette="primary">GM</Badge>}
        />
      }
    >
      <Container size="sm" className="desktop:px-0">
        <VStack gap="200" aria-busy className="pt-200 pb-200 desktop:pt-0 desktop:pb-0">
          <Skeleton width="60%" height={26} rounded={400} className="desktop:hidden" />
          <Grid cols={2} gap="100">
            <Skeleton height={68} rounded={500} />
            <Skeleton height={68} rounded={500} />
          </Grid>
          <Skeleton width="100%" height={18} rounded={400} />
          <Skeleton width="100%" height={96} rounded={500} />
          {range(CANDIDATE_COUNT).map((index) => (
            <Skeleton key={index} width="100%" height={68} rounded={500} />
          ))}
        </VStack>
      </Container>
    </PageShell>
  );
}
