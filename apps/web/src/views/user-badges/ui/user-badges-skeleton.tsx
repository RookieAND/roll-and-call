import { Card, Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

// 다른 사람 업적 화면 모양: 탭, 분류 제목, 업적 행 카드.
export function UserBadgesSkeleton() {
  return (
    <>
      <Container size="sm" className="px-0">
        <HStack align="center" gap="100" className="h-[46px] border-b border-gray-200 px-200">
          {range(3).map((index) => (
            <HStack key={index} justify="center" className="flex-1">
              <Skeleton width={48} height={14} />
            </HStack>
          ))}
        </HStack>
      </Container>
      <Container size="sm" className="pb-250">
        <VStack aria-busy gap="100" className="pt-175">
          <Skeleton width={72} height={14} />
          <Card.Root padding="none" radius={600} className="overflow-hidden">
            {range(5).map((index) => (
              <HStack
                key={index}
                align="center"
                gap="150"
                className="min-h-16 border-t border-gray-200 px-175 py-125 first:border-t-0"
              >
                <Skeleton width={40} height={40} rounded="full" />
                <VStack gap="050" className="min-w-0 flex-1">
                  <Skeleton width={104} height={16} />
                  <Skeleton width="70%" height={12} />
                </VStack>
                <Skeleton width={56} height={12} />
              </HStack>
            ))}
          </Card.Root>
        </VStack>
      </Container>
    </>
  );
}
