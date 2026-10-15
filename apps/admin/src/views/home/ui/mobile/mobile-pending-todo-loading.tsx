import { Button, HStack, Skeleton, VStack } from "@roll-and-call/ui";

// 조치 버튼은 글자를 바로 보이고 비활성으로 둔다.
export function MobilePendingTodoLoading() {
  return (
    <VStack
      gap="100"
      render={<li />}
      className="border-b border-(--rc-color-border-subtle) px-175 py-150 last:border-b-0"
    >
      <HStack align="center" gap="125">
        <Skeleton width={30} height={30} rounded={400} />
        <Skeleton width={120} height={16} />
        <Skeleton width={36} height={20} className="ml-auto" />
      </HStack>
      <Skeleton width="80%" height={12} />
      <Button variant="outline" colorPalette="gray" disabled className="h-11 w-full">
        처리하기
      </Button>
    </VStack>
  );
}
