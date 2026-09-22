import { Container, HStack, Skeleton } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

// 메모 삭제 줄은 이미 쓴 메모가 있을 때만 붙어서 뼈대에서 뺀다.
export default function Loading() {
  return (
    <Container size="sm" className="px-0">
      <AppBar
        back="/games"
        title="메모"
        action={<Skeleton width={48} height={36} className="mr-100" />}
      />

      <HStack align="center" gap="150" className="border-b border-gray-100 px-200 py-175">
        <Skeleton width={48} height={48} rounded="full" />
        <div className="min-w-0 flex-1">
          <Skeleton width={96} height={21} />
          <Skeleton width={80} height={17} className="mt-025" />
        </div>
      </HStack>

      <div className="p-200">
        <Skeleton width="100%" height={150} rounded={400} />
        <HStack align="baseline" gap="100" className="mt-100">
          <Skeleton height={17} className="flex-1" />
          <Skeleton width={64} height={17} className="flex-none" />
        </HStack>
      </div>
    </Container>
  );
}
