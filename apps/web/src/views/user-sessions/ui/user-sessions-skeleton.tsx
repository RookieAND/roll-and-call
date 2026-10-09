"use client";

import { Container, HStack, Skeleton } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

export function UserSessionsSkeleton() {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <AppBar back={`/users/${id}`} title="세션" />
      <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface">
        <HStack className="px-200">
          <HStack align="center" justify="center" className="h-11 flex-1">
            <Skeleton width={64} height={20} />
          </HStack>
          <HStack align="center" justify="center" className="h-11 flex-1">
            <Skeleton width={64} height={20} />
          </HStack>
        </HStack>
      </div>
      <Container size="sm">
        <div className="py-250">
          <SessionListSkeleton />
        </div>
      </Container>
    </>
  );
}
