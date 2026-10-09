import { Container, FloatingBar, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function EditProfileSkeleton() {
  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap="250" className="pt-300 pb-500">
          <HStack align="center" gap="150">
            <Skeleton width={60} height={60} rounded="full" />
            <Skeleton height={20} className="flex-1" />
            <Skeleton width={104} height={36} rounded={400} />
          </HStack>
          <VStack gap="100">
            <Skeleton width={80} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={96} height={20} />
            <Skeleton width="100%" height={76} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={40} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={40} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={80} height={20} />
            <Skeleton width="100%" height={52} rounded={500} />
          </VStack>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <HStack gap="100">
            <Skeleton height={48} rounded={500} className="flex-1" />
            <Skeleton height={48} rounded={500} className="flex-1" />
          </HStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
