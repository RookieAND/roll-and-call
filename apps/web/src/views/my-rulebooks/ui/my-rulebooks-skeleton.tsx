import { Card, Container, FloatingBar, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

const SECTION_ROW_COUNTS = [2, 3];

export function MyRulebooksSkeleton() {
  return (
    <>
      <AppBar back="/me" title="내 룰북" />
      <Container size="sm">
        <VStack gap="250" aria-busy className="pt-200 pb-250">
          {SECTION_ROW_COUNTS.map((rowCount) => (
            <VStack key={rowCount} gap="125">
              <HStack align="baseline" gap="100">
                <Skeleton width={90} height={24} />
                <Skeleton width={60} height={17} />
              </HStack>
              <Card.Root padding="none" className="overflow-hidden">
                {range(rowCount).map((index) => (
                  <HStack
                    key={index}
                    align="center"
                    gap="150"
                    className="min-h-[60px] border-t border-gray-100 px-175 py-125 first:border-t-0"
                  >
                    <Skeleton width={20} height={20} rounded="full" />
                    <VStack gap="025" className="min-w-0 flex-1">
                      <Skeleton width={140} height={17} />
                      <Skeleton width={100} height={14} />
                    </VStack>
                    <Skeleton width={48} height={22} rounded="full" />
                  </HStack>
                ))}
              </Card.Root>
            </VStack>
          ))}
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Skeleton width="100%" height={48} rounded={500} />
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
