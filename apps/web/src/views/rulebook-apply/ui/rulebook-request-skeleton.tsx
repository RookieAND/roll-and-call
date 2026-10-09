import { Container, FloatingBar, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function RulebookRequestSkeleton() {
  return (
    <>
      <AppBar back="/me/rulebooks/apply" title="룰북 추가 요청" heading={false} />
      <Container size="sm">
        <VStack className="pt-250 pb-300" aria-busy>
          <VStack gap="175">
            <VStack gap="050">
              <Skeleton width="80%" height={21} />
              <Skeleton width="60%" height={21} />
            </VStack>
            <Skeleton width="100%" height={72} rounded={300} />
            <Skeleton width="100%" height={72} rounded={300} />
            <Skeleton width="100%" height={72} rounded={300} />
            <Skeleton width="100%" height={168} rounded={300} />
            <Skeleton width="100%" height={72} rounded={300} />
          </VStack>
          <FloatingBar.Root elevated={false}>
            <FloatingBar.Content>
              <Container size="sm">
                <Skeleton width="100%" height={48} rounded={500} />
              </Container>
            </FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>
        </VStack>
      </Container>
    </>
  );
}
