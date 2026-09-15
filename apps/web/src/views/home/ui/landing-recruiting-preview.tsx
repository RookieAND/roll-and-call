import { HStack, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { GameRow } from "@/entities/game";
import { getRecruitingGamesPage } from "@/shared/server";

const PREVIEW_COUNT = 2;

export async function LandingRecruitingPreview() {
  const { rows } = await getRecruitingGamesPage(1, {}, PREVIEW_COUNT);

  return (
    <VStack gap={3} className="border-t border-gray-100 px-6 pt-6">
      <HStack justify="between" align="center">
        <Text typography="subtitle1">지금 모집 중</Text>
        <Link href="/games">
          <Text
            typography="body2"
            foreground="primary"
            className="inline-flex items-center gap-0.5"
          >
            전체 보기 <ChevronRight size={14} aria-hidden />
          </Text>
        </Link>
      </HStack>
      {rows.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`} className="block">
          <GameRow game={game} />
        </Link>
      ))}
    </VStack>
  );
}
