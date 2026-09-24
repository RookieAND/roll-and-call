import { Skeleton, Text, VStack } from "@roll-and-call/ui";

interface StatTileLoadingProps {
  label: string;
}

export function StatTileLoading({ label }: StatTileLoadingProps) {
  return (
    <VStack gap="075" className="min-w-0 rounded-400 border border-gray-200 px-150 py-125">
      <Text typography="body4" foreground="hint" truncate>
        {label}
      </Text>
      <Skeleton width={56} height={24} />
    </VStack>
  );
}
