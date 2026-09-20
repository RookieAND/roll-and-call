import { Container, Grid, HStack, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 메모 블록은 로그인한 뷰어에게만 붙고, 두 번째 세션 섹션은 스크롤 아래라 뼈대에서 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <div className="px-200 pt-250 pb-050">
          <HStack align="center" gap="175">
            <Skeleton width={64} height={64} rounded="full" />
            <div className="min-w-0 flex-1">
              <Skeleton width={128} height={27} />
              <Skeleton width={112} height={20} className="mt-050" />
            </div>
          </HStack>
          <Skeleton width="75%" height={24} className="mt-175" />
          <div className="mt-175">
            <Skeleton width={40} height={17} className="mb-100" />
            <HStack gap="075">
              <Skeleton width={80} height={30} rounded="full" />
              <Skeleton width={64} height={30} rounded="full" />
            </HStack>
          </div>
        </div>

        <section className="p-200">
          <Skeleton width={40} height={17} className="mb-100" />
          <Skeleton width="100%" height={52} rounded={500} />
        </section>

        <section className="px-200 pb-200">
          <Skeleton width={80} height={17} className="mb-100" />
          <Skeleton width="100%" height={52} rounded={500} />
        </section>

        <Grid cols={2} className="border-t border-gray-200">
          {Array.from({ length: 2 }).map((_, index) => (
            <VStack
              key={index}
              align="center"
              gap="050"
              className="border-gray-200 py-175 not-first:border-l"
            >
              <Skeleton width={24} height={27} />
              <Skeleton width={64} height={17} />
            </VStack>
          ))}
        </Grid>

        <div aria-hidden className="h-2 border-y border-gray-200 bg-gray-100" />
        <section className="px-200 py-250">
          <HStack align="baseline" gap="125" className="mb-125">
            <Skeleton width={64} height={21} />
            <Skeleton width={16} height={20} />
          </HStack>
          <SessionListSkeleton count={2} />
        </section>
      </Container>
    </>
  );
}
