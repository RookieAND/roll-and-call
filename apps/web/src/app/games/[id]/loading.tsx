import { Container, Skeleton, VStack } from "@trpg/ui";
import { AppBar } from "@/shared/ui";

// GameDetail과 같은 박스를 같은 순서로 그린다. 높이는 실제 줄 높이 기준:
// 제목 heading1 28px · 뱃지 21px · 정보표 행 py-3 + 20px(GM 행은 아바타 24px) · 참여자 아바타 34px.
const INFO_ROWS = [
  { key: "룰", value: "h-5 w-24" },
  { key: "GM", value: "h-6 w-28" },
  { key: "인원", value: "h-5 w-16" },
  { key: "모집 마감일", value: "h-5 w-32" },
  { key: "세션 일정", value: "h-5 w-32" },
];

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap={4}>
          <Skeleton className="h-42 w-full rounded-none" />

          <VStack gap={4} className="px-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="mt-0.5 h-[21px] w-14 rounded-[7px]" />
            </div>

            <div className="overflow-hidden rounded-[14px] border border-gray-200">
              {INFO_ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
                >
                  <div className="w-[82px] shrink-0">
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className={row.value} />
                </div>
              ))}
            </div>

            <VStack gap={2}>
              <Skeleton className="h-[22px] w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </VStack>

            <VStack gap={2}>
              <Skeleton className="h-[22px] w-20" />
              <Skeleton className="h-[34px] w-32 rounded-full" />
            </VStack>
          </VStack>

          {/* GameDetailActions의 하단 고정 바와 같은 박스(bottom-[58px] = BottomNav 높이). */}
          <div className="sticky bottom-[58px] z-10 border-t border-gray-100 bg-surface px-4 py-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </VStack>
      </Container>
    </>
  );
}
