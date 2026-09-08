import { Container, Skeleton, VStack } from "@trpg/ui";
import { AppBar } from "@/shared/ui";
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap={4} className="pb-6">
          <Skeleton className="h-[168px] w-full rounded-none" />
          <VStack gap={4} className="px-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <VStack gap={2}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </VStack>
            <VStack gap={2}>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </VStack>
            <Skeleton className="h-[50px] w-full rounded-xl" />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
