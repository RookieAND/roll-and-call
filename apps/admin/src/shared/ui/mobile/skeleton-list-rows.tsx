import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

interface SkeletonListRowsProps {
  rows?: number;
  // 셋째 줄(보조 정보)이 있는 목록인지
  meta?: boolean;
}

// ListRow와 같은 틀에 서버 값 자리만 뼈대로 채운다.
export function SkeletonListRows({ rows = 6, meta = false }: SkeletonListRowsProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <VStack
          key={index}
          gap="075"
          className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-175"
        >
          <HStack align="center" justify="between" gap="100" className="min-h-6">
            <Skeleton width="45%" height={16} />
            <Skeleton width={64} height={14} />
          </HStack>
          <Skeleton width="70%" height={14} />
          {meta ? <Skeleton width="35%" height={12} /> : null}
        </VStack>
      ))}
    </>
  );
}
