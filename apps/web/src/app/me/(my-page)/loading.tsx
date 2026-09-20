import { Container, HStack, Skeleton, VStack } from "@trpg/ui";

import { AppBar, HelpButton } from "@/shared/ui";

// 할 일 카드는 있을 때만 그려지므로 뼈대에서는 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar title="마이페이지" action={<HelpButton />} />
      <Container size="sm">
        <VStack gap="250" className="py-225">
          <VStack gap="175" render={<section />}>
            <HStack align="center" gap="175">
              <Skeleton width={60} height={60} rounded="full" />
              <div className="min-w-0 flex-1">
                <Skeleton width={112} height={25} />
                <Skeleton width={176} height={20} className="mt-050" />
              </div>
              <Skeleton width={52} height={36} rounded={400} className="flex-none" />
            </HStack>
            <div>
              <Skeleton width={40} height={17} className="mb-100" />
              <HStack gap="075">
                <Skeleton width={80} height={30} rounded="full" />
                <Skeleton width={64} height={30} rounded="full" />
              </HStack>
            </div>
            <div>
              <Skeleton width={80} height={17} className="mb-100" />
              <Skeleton width="100%" height={52} rounded={500} />
            </div>
          </VStack>

          <VStack gap="125" render={<section />}>
            <Skeleton width={64} height={22} />
            <Skeleton width="100%" height={120} rounded={600} />
          </VStack>

          <section>
            <Skeleton width={40} height={22} className="mb-125" />
            <Skeleton width="100%" height={52} rounded={500} />
          </section>

          <VStack gap="125" render={<section />}>
            <Skeleton width={40} height={22} />
            <Skeleton width="100%" height={104} rounded={600} />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
