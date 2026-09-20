import { Container, HStack, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

const CANDIDATE_COUNT = 3;

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="세션 시간 결정" />
      <Container size="sm">
        <VStack gap="250" className="pt-200 pb-200">
          <HStack gap="100">
            <Skeleton height={70} rounded={500} className="flex-1" />
            <Skeleton height={70} rounded={500} className="flex-1" />
          </HStack>
          <HStack gap="100">
            <Skeleton height={44} rounded={400} className="min-w-0 flex-1" />
            <Skeleton width={152} height={44} rounded={400} className="shrink-0" />
          </HStack>
          <div className="overflow-hidden rounded-500 border border-gray-200">
            {Array.from({ length: CANDIDATE_COUNT }).map((_, index) => (
              <HStack
                key={index}
                align="center"
                gap="150"
                className="border-gray-100 px-150 py-125 not-first:border-t"
              >
                <div className="min-w-0 flex-1">
                  <Skeleton width={176} height={21} />
                  <Skeleton width={112} height={20} className="mt-025" />
                </div>
                <Skeleton width={32} height={32} className="shrink-0" />
              </HStack>
            ))}
          </div>
        </VStack>
      </Container>
    </>
  );
}
