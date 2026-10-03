import { Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

export function DexSkeleton() {
  return (
    <VStack aria-busy className="pb-300">
      <HStack align="center" gap="100" className="h-[46px] border-b border-gray-200 px-200">
        {range(3).map((index) => (
          <HStack key={index} justify="center" className="flex-1">
            <Skeleton width={40} height={14} />
          </HStack>
        ))}
      </HStack>
      <VStack gap="150" className="px-200 pt-225">
        <Skeleton width="100%" height={88} rounded={500} />
        <Skeleton width="100%" height={88} rounded={500} />
        <Grid cols={4} gap="100">
          {range(8).map((index) => (
            <VStack key={index} align="center" gap="100" className="pt-150 pb-125">
              <Skeleton width={48} height={48} rounded="full" />
              <Skeleton width={40} height={12} />
            </VStack>
          ))}
        </Grid>
      </VStack>
    </VStack>
  );
}
