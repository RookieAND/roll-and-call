import { Skeleton, VStack } from "@roll-and-call/ui";

export function ServerWelcomeSkeleton() {
  return (
    <VStack
      aria-busy
      className="min-h-dvh overflow-hidden"
      style={{ backgroundImage: "var(--gradient-onboarding)" }}
    >
      <VStack align="center" justify="center" gap="225" className="flex-1 px-300 pb-700">
        <Skeleton width={104} height={104} rounded={700} />
        <VStack align="center" gap="125">
          <Skeleton width={72} height={26} rounded={300} />
          <Skeleton width={220} height={30} />
          <Skeleton width={260} height={18} />
        </VStack>
      </VStack>
      <VStack gap="250" className="rounded-t-800 bg-surface px-300 pt-400 pb-300">
        <Skeleton width="100%" height={72} rounded={400} />
        <Skeleton width="100%" height={48} rounded={400} />
      </VStack>
    </VStack>
  );
}
