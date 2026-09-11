import Image from "next/image";
import Link from "next/link";
import { Button, Text, VStack } from "@trpg/ui";

// 구인 목록 · 필터/검색 결과 0건 (전체화면 빈 상태).
export function GamesEmpty() {
  return (
    <VStack gap={4} className="items-center px-5 pt-[76px] pb-[90px] text-center">
      <Image
        src="/empty-states/empty-search.png"
        alt="조건에 맞는 구인이 없습니다"
        width={140}
        height={140}
      />
      <div>
        <Text typography="heading3" className="block">
          조건에 맞는 구인이 없습니다
        </Text>
        <Text typography="body2" foreground="muted" className="mt-1 block">
          검색어를 바꾸거나
          <br />
          직접 구인을 올려보세요.
        </Text>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/games">검색 초기화</Link>
        </Button>
        <Button asChild>
          <Link href="/games/new">새 구인 등록</Link>
        </Button>
      </div>
    </VStack>
  );
}
