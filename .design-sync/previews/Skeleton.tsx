import { Skeleton, VStack, HStack } from "@roll-and-call/ui";

export const GameCard = () => (
  <VStack gap="100" className="w-64">
    <Skeleton width="100%" height={78} rounded={600} />
    <Skeleton width={192} height={17} />
    <Skeleton width={128} height={15} />
  </VStack>
);

export const RoundedSweep = () => (
  <HStack gap="100" className="items-center">
    <Skeleton width={44} height={44} rounded="none" />
    <Skeleton width={44} height={44} rounded={200} />
    <Skeleton width={44} height={44} rounded={500} />
    <Skeleton width={44} height={44} rounded="full" />
  </HStack>
);

export const ProfileRow = () => (
  <HStack gap="100" className="items-center">
    <Skeleton width={40} height={40} rounded="full" />
    <VStack gap="075">
      <Skeleton width={96} height={15} />
      <Skeleton width={64} height={13} />
    </VStack>
  </HStack>
);
