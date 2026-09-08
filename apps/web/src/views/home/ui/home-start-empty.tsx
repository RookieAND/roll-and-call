import Link from "next/link";
import { Button, VStack } from "@trpg/ui";
import { EmptyState } from "@/shared/ui/empty-state";

// 홈 · 신규 가입 직후(참여/운영 세션 0건) 시작 안내 빈 상태.
export function HomeStartEmpty() {
  return (
    <EmptyState
      image="/empty-states/empty-my-games.png"
      imageAlt="아직 참여 중인 게임이 없습니다"
      title="두 가지 방법으로 시작합니다"
      description="모집 중인 세션에 참여하거나, GM이 되어 직접 구인을 올리세요."
      action={
        <VStack gap={2} className="w-full pt-1">
          <Button asChild size="lg" className="h-12 w-full">
            <Link href="/games">구인 목록 둘러보기</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 w-full">
            <Link href="/games/new">새 구인 등록</Link>
          </Button>
        </VStack>
      }
    />
  );
}
