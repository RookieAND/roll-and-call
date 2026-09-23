import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Dice5, Zap } from "lucide-react";

import { PARTICIPANT_STATUS, RECRUIT_METHOD, recruitMethodLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

interface GameRecruitMethodSectionProps {
  game: GameDetailData;
}

export function GameRecruitMethodSection({ game }: GameRecruitMethodSectionProps) {
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  const Icon = isLottery ? Dice5 : Zap;
  // 등록 때 직접 확정한 사람은 추첨 순위가 없고, 그만큼 뽑을 자리가 줄어든다.
  const preConfirmedCount = game.participants.filter(
    (participant) =>
      participant.status === PARTICIPANT_STATUS.confirmed && participant.drawRank === null,
  ).length;
  const drawCount = Math.max(game.maxPlayers - preConfirmedCount, 0);
  const lines = isLottery
    ? ["정원과 관계없이 신청을 받습니다.", `마감 뒤 GM이 추첨으로 ${drawCount}명을 정합니다.`]
    : [
        "신청한 순서대로 정원까지 바로 확정됩니다.",
        game.waitlistEnabled
          ? "정원이 차도 대기로 신청할 수 있습니다."
          : "정원이 차면 신청이 닫힙니다.",
      ];

  return (
    <VStack gap="100" render={<section />}>
      <Text typography="subtitle2" render={<h2 />}>
        모집 방식
      </Text>
      <Card.Root radius={500} padding="none" className="px-175 py-150">
        <HStack align="center" gap="150">
          <span className="flex size-[38px] flex-none items-center justify-center rounded-400 bg-tinted-bg text-tinted-ink">
            <Icon size={20} aria-hidden />
          </span>
          <VStack gap="050" className="min-w-0 flex-1">
            <Text typography="subtitle1" weight="extrabold" render={<p />}>
              {recruitMethodLabel(game.recruitMethod)}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />} className="text-pretty">
              {lines[0]}
              <br />
              {lines[1]}
            </Text>
          </VStack>
        </HStack>
      </Card.Root>
    </VStack>
  );
}
