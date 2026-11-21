import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar, PageShell } from "@/shared/ui";

import { UsersSkeleton } from "./users-skeleton";

export function UsersLoading() {
  return (
    <PageShell appBar={<AppBar title="유저" />}>
      <Container size="sm" className="py-150 desktop:max-w-none">
        <VStack gap="150">
          <HStack align="center" gap="050">
            <Skeleton height={44} rounded={300} className="flex-1" />
            <Skeleton width={44} height={44} rounded={300} />
          </HStack>
          <Skeleton width={80} height={20} />
          <UsersSkeleton />
        </VStack>
      </Container>
    </PageShell>
  );
}
