import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { EmptyState } from "@/shared/ui";

export function HomeStartEmpty() {
  return (
    <EmptyState
      image="/empty-states/empty-my-games.png"
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
