import { Skeleton, VStack } from "@trpg/ui";

export const CardLoading = () => (
  <VStack gap={3} className="w-72 rounded-[14px] border border-gray-200 p-4">
    <div className="flex items-start justify-between gap-2">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-1 w-full" />
    <Skeleton className="h-11 w-full rounded-xl" />
  </VStack>
);
