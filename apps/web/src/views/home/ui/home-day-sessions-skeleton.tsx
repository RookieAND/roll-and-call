import { Skeleton, Text, VStack } from "@roll-and-call/ui";

interface HomeDaySessionsSkeletonProps {
  date: string;
}

export function HomeDaySessionsSkeleton({ date }: HomeDaySessionsSkeletonProps) {
  return (
    <>
      <Text typography="heading3" render={<h3 />} className="mb-150 font-extrabold">
        {date}
      </Text>
      <VStack gap="100">
        <Skeleton width="100%" height={72} rounded={600} />
        <Skeleton width="100%" height={72} rounded={600} />
      </VStack>
    </>
  );
}
