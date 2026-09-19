import { Text, VStack } from "@trpg/ui";

import { RECRUIT_METHOD } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

export function GameRecruitMethodSection({ game }: { game: GameDetailData }) {
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  const lines = isLottery
    ? ["정원과 관계없이 신청을 받습니다.", `마감 뒤 GM이 추첨으로 ${game.maxPlayers}명을 정합니다.`]
    : [
        "신청한 순서대로 정원까지 확정됩니다.",
        game.waitlistEnabled
          ? "정원이 차도 대기로 신청할 수 있습니다."
          : "정원이 차면 신청이 닫힙니다.",
      ];

  return (
    <VStack gap={2}>
      <Text typography="heading3" render={<h2 />}>
        모집 방식
      </Text>
      <VStack gap={1} className="rounded-xl border border-gray-200 px-3.5 py-3">
        <Text typography="subtitle1" render={<p />}>
          {isLottery ? "추첨" : "선착순"}
        </Text>
        {lines.map((line) => (
          <Text key={line} typography="body4" foreground="muted" render={<p />}>
            {line}
          </Text>
        ))}
      </VStack>
    </VStack>
  );
}
