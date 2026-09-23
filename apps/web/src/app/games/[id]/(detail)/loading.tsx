import { Container, FloatingBar, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

// 높이는 GameDetail의 실제 줄 높이를 따른다. 한쪽만 바꾸면 로딩 후 레이아웃이 튄다.
export default function Loading() {
  return (
    <FloatingBar.Root elevated={false}>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap="200">
          <Skeleton width="100%" height={168} rounded="none" />
          <VStack gap="150" className="px-200 pb-100">
            <Skeleton width={180} height={26} />
            <Skeleton width={140} height={14} />
            <Skeleton width="100%" height={200} rounded={500} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="80%" height={14} />
            <Skeleton width="100%" height={160} rounded={600} />
          </VStack>
        </VStack>
      </Container>
      <FloatingBar.Content aria-busy>
        <Skeleton width="100%" height={48} rounded={500} />
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
