import { Skeleton, Text, VStack } from "@roll-and-call/ui";

interface SkeletonFieldProps {
  label: string;
  height?: number;
  className?: string;
}

// 입력란 라벨은 그리고 값 자리만 비운다.
export function SkeletonField({ label, height = 40, className }: SkeletonFieldProps) {
  return (
    <VStack gap="075" className={className}>
      <Text typography="body4" weight="bold" foreground="muted">
        {label}
      </Text>
      <Skeleton width="100%" height={height} rounded={400} />
    </VStack>
  );
}
