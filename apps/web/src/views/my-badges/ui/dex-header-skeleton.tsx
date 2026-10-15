import { Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

export function DexHeaderSkeleton() {
  return (
    <>
      <HStack align="baseline" gap="100" className="border-b-8 border-gray-50 p-200">
        <Skeleton width={64} height={16} className="flex-1" />
        <Skeleton width={48} height={26} />
      </HStack>
      <VStack gap="150" className="border-b-8 border-gray-50 p-200">
        <HStack align="center" gap="150">
          <VStack gap="050" className="min-w-0 flex-1">
            <Skeleton width={72} height={18} />
            <Skeleton width={180} height={12} />
          </VStack>
          <Skeleton width={56} height={32} rounded={300} />
        </HStack>
        <Grid cols={3} gap="100">
          {range(3).map((index) => (
            <VStack key={index} align="center" gap="125" className="pt-175 pb-150">
              <Skeleton width={52} height={52} rounded="full" />
              <Skeleton width={56} height={12} />
            </VStack>
          ))}
        </Grid>
      </VStack>
    </>
  );
}
