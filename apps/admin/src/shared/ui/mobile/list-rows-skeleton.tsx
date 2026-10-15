import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

const ROWS = 6;

// 모바일 목록을 불러오는 동안: 정렬 줄의 건수와 줄마다 서버 값만 뼈대로 그린다.
export function ListRowsSkeleton() {
  return (
    <>
      <HStack
        align="center"
        className="min-h-11 border-b border-(--rc-color-border-subtle) bg-surface px-200"
      >
        <Skeleton width={40} height={12} />
      </HStack>
      {Array.from({ length: ROWS }, (_, index) => (
        <VStack
          key={index}
          gap="075"
          className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-175"
        >
          <HStack justify="between" gap="100">
            <Skeleton width="45%" height={18} />
            <Skeleton width={48} height={18} />
          </HStack>
          <Skeleton width="70%" height={14} />
          <Skeleton width="50%" height={12} />
        </VStack>
      ))}
    </>
  );
}
