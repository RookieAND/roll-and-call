import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

const TITLE_WIDTHS = [140, 110];

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="내 룰북" />
      <Container size="sm">
        <VStack gap="150" aria-busy className="pt-200 pb-250">
          {TITLE_WIDTHS.map((width) => (
            <VStack key={width} gap="150" className="rounded-600 border border-gray-200 p-175">
              <Skeleton width={width} height={18} />
              <HStack align="center" justify="between">
                <Skeleton width={150} height={14} />
                <Skeleton width={60} height={22} rounded="full" />
              </HStack>
              <Skeleton width={200} height={12} />
            </VStack>
          ))}
        </VStack>
      </Container>
    </>
  );
}
