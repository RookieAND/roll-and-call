import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

const ROW_WIDTHS = [220, 160, 200] as const;

export function HomebrewDetailSkeleton() {
  return (
    <PageShell readable appBar={<AppBar back="/me/rulebooks" title="자작 룰" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <VStack aria-busy gap="200" className="px-200 pt-200 pb-250">
          <VStack gap="100">
            <Skeleton width={180} height={24} />
            <Skeleton width={140} height={18} />
          </VStack>
          <Card.Root
            background="subtle"
            padding="none"
            radius={500}
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
          >
            {ROW_WIDTHS.map((width) => (
              <HStack key={width} align="center" gap="150" className="min-h-12 px-200 py-125">
                <Skeleton width={56} height={12} />
                <Skeleton width={width} height={16} />
              </HStack>
            ))}
          </Card.Root>
          <VStack gap="100">
            <Skeleton width={80} height={20} />
            <Skeleton width={260} height={14} />
          </VStack>
        </VStack>
      </div>
    </PageShell>
  );
}
