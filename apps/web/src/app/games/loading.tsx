import Link from "next/link";
import { Button, Container, Skeleton, TextInput, VStack } from "@trpg/ui";
import { AppBar } from "@/shared/ui/app-bar";

// 시안 2b: search + filter bar render immediately (not skeletonized); only cards shimmer.
export default function Loading() {
  return (
    <>
      <AppBar
        title="구인 목록"
        action={
          <Link href="/games/new">
            <Button size="sm">새 구인</Button>
          </Link>
        }
      />
      <Container>
        <VStack gap={4} className="py-4">
          <TextInput placeholder="게임명 · 룰 검색" disabled />
          <div className="flex gap-2">
            {["전체", "일정조율", "확정", "마감"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-gray-200 bg-surface px-[11px] py-1.5 text-[12.5px] font-semibold text-gray-600"
              >
                {c}
              </span>
            ))}
          </div>
          <VStack className="gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[14px] border border-gray-200 p-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-2 h-3 w-1/3" />
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
