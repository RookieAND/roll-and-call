import { Card, Skeleton, VStack } from "@roll-and-call/ui";

export function GamesFilterPanelSkeleton() {
  return (
    <aside
      aria-hidden
      className="sticky top-4 desktop:top-[calc(var(--rc-size-appbar)+var(--games-bar-h,7rem)+1rem)] hidden w-80 flex-none desktop:block"
    >
      <Card.Root radius={600} padding="none" className="p-250">
        <VStack gap="225">
          <Skeleton width={40} height={24} />
          <Skeleton height={48} rounded={500} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </VStack>
      </Card.Root>
    </aside>
  );
}
