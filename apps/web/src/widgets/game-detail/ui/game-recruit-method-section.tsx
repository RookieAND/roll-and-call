import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { Dice5, UserCheck, Zap } from "lucide-react";

import { PARTICIPANT_STATUS, RECRUIT_METHOD, recruitMethodLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { methodLines } from "../model/method-lines";
import { minPlayersLine } from "../model/min-players-line";

const METHOD_ICON = {
  [RECRUIT_METHOD.firstCome]: Zap,
  [RECRUIT_METHOD.lottery]: Dice5,
  [RECRUIT_METHOD.selection]: UserCheck,
} as const;

interface GameRecruitMethodSectionProps {
  game: GameDetailData;
  now: Date;
}

export function GameRecruitMethodSection({ game, now }: GameRecruitMethodSectionProps) {
  const Icon = METHOD_ICON[game.recruitMethod];
  // 등록 때 직접 확정한 사람은 추첨 순위가 없고, 그만큼 뽑을 자리가 줄어든다.
  const preConfirmedCount = game.participants.filter(
    (participant) =>
      participant.status === PARTICIPANT_STATUS.confirmed && isNull(participant.drawRank),
  ).length;
  const lines = methodLines({
    game,
    drawCount: Math.max(game.maxPlayers - preConfirmedCount, 0),
  });

  const minPlayersText = minPlayersLine({
    minPlayers: game.minPlayers,
    endDate: game.endDate,
    now,
    recruitMethod: game.recruitMethod,
  });

  return (
    <VStack gap="100" render={<section />}>
      <Text typography="subtitle2" render={<h2 />}>
        모집 방식
      </Text>
      <Card.Root radius={500} padding="none" className="px-175 py-150">
        <HStack align="center" gap="150">
          <span className="flex size-9.5 flex-none items-center justify-center rounded-400 bg-tinted-bg text-tinted-ink">
            <Icon size={20} aria-hidden />
          </span>
          <VStack gap="050" className="min-w-0 flex-1">
            <Text typography="subtitle1" weight="extrabold" render={<p />}>
              {recruitMethodLabel(game.recruitMethod)}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />} className="text-pretty break-keep">
              {lines[0]}
              <br />
              {lines[1]}
              {minPlayersText && (
                <>
                  <br />
                  {minPlayersText}
                </>
              )}
            </Text>
          </VStack>
        </HStack>
      </Card.Root>
    </VStack>
  );
}
