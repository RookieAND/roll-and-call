import { Container, Skeleton, VStack } from "@trpg/ui";
import { AppBar } from "@/shared/ui";

// GameScheduleView와 같은 배치: 제목·기간 → 탭 → 격자(헤더 40px + 26px × 9행).
export default function Loading() {
  return (
    <>
      <AppBar title="일정 조율" />
      <Container>
        <VStack gap={5} className="pt-5 pb-4">
          <VStack gap={1}>
            <Skeleton className="h-[22px] w-1/2" />
            <Skeleton className="h-4 w-32" />
          </VStack>
          <Skeleton className="h-11 w-full rounded-[11px]" />
          <Skeleton className="h-[274px] w-full rounded-xl" />
        </VStack>
      </Container>
    </>
  );
}
