import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { MyHomebrewFrame } from "./my-homebrew-frame";

const NAME_WIDTHS = [140, 110] as const;

export function MyHomebrewSkeleton() {
  return (
    <MyHomebrewFrame>
      <Card.Root padding="none" className="overflow-hidden" aria-busy>
        {NAME_WIDTHS.map((nameWidth) => (
          <HStack
            key={nameWidth}
            align="center"
            gap="150"
            className="min-h-17 border-t border-gray-100 px-200 py-150 first:border-t-0"
          >
            <VStack gap="075" className="min-w-0 flex-1">
              <Skeleton width={nameWidth} height={16} />
              <Skeleton width={220} height={12} />
            </VStack>
            <Skeleton width={52} height={24} />
          </HStack>
        ))}
      </Card.Root>
    </MyHomebrewFrame>
  );
}
