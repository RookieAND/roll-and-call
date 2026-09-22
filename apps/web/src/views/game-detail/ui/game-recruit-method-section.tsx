import { HStack, Text, VStack } from "@trpg/ui";
import { ListOrdered, Trophy } from "lucide-react";

import { RECRUIT_METHOD, recruitMethodLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { IconTile } from "@/shared/ui";

interface GameRecruitMethodSectionProps {
  game: GameDetailData;
}

export function GameRecruitMethodSection({ game }: GameRecruitMethodSectionProps) {
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  const Icon = isLottery ? Trophy : ListOrdered;
  const lines = isLottery
    ? ["정원과 관계없이 신청을 받습니다.", `마감 뒤 GM이 추첨으로 ${game.maxPlayers}명을 정합니다.`]
    : [
        "신청한 순서대로 정원까지 확정됩니다.",
        game.waitlistEnabled
          ? "정원이 차도 대기로 신청할 수 있습니다."
          : "정원이 차면 신청이 닫힙니다.",
      ];

  return (
    <VStack gap="100">
      <Text typography="heading3" render={<h2 />}>
        모집 방식
      </Text>
      <HStack gap="150" className="rounded-500 border border-gray-200 px-175 py-150">
        <IconTile icon={Icon} tone="muted" />
        <VStack gap="050" className="min-w-0 flex-1">
          <Text typography="subtitle1" render={<p />}>
            {recruitMethodLabel(game.recruitMethod)}
          </Text>
          <VStack gap={0}>
            {lines.map((line) => (
              <Text key={line} typography="body4" foreground="muted" render={<p />}>
                {line}
              </Text>
            ))}
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
