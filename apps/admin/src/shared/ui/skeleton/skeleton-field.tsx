import { Skeleton, Text, VStack } from "@roll-and-call/ui";

interface SkeletonFieldProps {
  label: string;
  height?: number;
  className?: string;
}

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
