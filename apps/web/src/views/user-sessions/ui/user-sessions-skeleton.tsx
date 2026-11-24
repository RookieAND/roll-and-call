"use client";

import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

const SKELETON_ROWS = [0, 1, 2] as const;

export function UserSessionsSkeleton() {
  const { id } = useParams<{ id: string }>();
  return (
    <PageShell appBar={<AppBar back={`/users/${id}`} title="세션 목록" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface desktop:static">
          <HStack className="px-200">
            <HStack align="center" justify="center" className="h-11 flex-1">
              <Skeleton width={64} height={20} />
            </HStack>
            <HStack align="center" justify="center" className="h-11 flex-1">
              <Skeleton width={64} height={20} />
            </HStack>
          </HStack>
        </div>
        <Container size="sm" className="desktop:max-w-none">
          <VStack gap="100" className="py-250" aria-busy>
            <Skeleton width={120} height={20} />
            {SKELETON_ROWS.map((row) => (
              <HStack
                key={row}
                align="center"
                className="gap-175 rounded-600 border border-gray-200 p-150"
              >
                <Skeleton width={64} height={60} rounded={500} />
                <VStack gap="050" className="flex-1">
                  <Skeleton width="60%" height={18} />
                  <Skeleton width="40%" height={14} />
                </VStack>
                <Skeleton width={52} height={22} />
              </HStack>
            ))}
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
