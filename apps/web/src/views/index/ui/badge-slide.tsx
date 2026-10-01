import { Avatar, HStack, Text, VStack } from "@roll-and-call/ui";
import { Award, Bell, UserRound } from "lucide-react";

import { BadgeMedal, TIER_NAME } from "@/entities/badge";

import { ACHIEVEMENT_MEDALS, FEATURED_MEDALS } from "../model/demo-medals";
import { PreviewCard } from "./preview-card";

export function BadgeSlide() {
  return (
    <>
      <PreviewCard icon={Award} title="업적" aside="6 / 24" wide>
        <div className="grid grid-cols-3 gap-x-100 gap-y-175">
          {ACHIEVEMENT_MEDALS.map((medal) => (
            <VStack key={medal.name} align="center" gap="075" className="min-w-0 text-center">
              <BadgeMedal emoji={medal.emoji} look={medal.grade} size="md" />
              <VStack gap="025" className="max-w-full min-w-0">
                <Text typography="body3" weight="extrabold" truncate>
                  {medal.name}
                </Text>
                <Text typography="body5" weight="bold" foreground="hint">
                  {TIER_NAME[medal.grade]}
                </Text>
              </VStack>
            </VStack>
          ))}
        </div>
      </PreviewCard>
      <PreviewCard icon={UserRound} title="프로필">
        <HStack align="center" gap="100" className="min-w-0">
          <Avatar size="md" name="라온" />
          <VStack gap="025" className="min-w-0">
            <Text typography="subtitle2" weight="extrabold" truncate>
              라온
            </Text>
            <Text typography="body4" foreground="hint" numeric truncate>
              참여 64 · 운영 86
            </Text>
          </VStack>
        </HStack>
        <VStack gap="050">
          <Text typography="body5" weight="bold" foreground="hint">
            대표 뱃지
          </Text>
          <HStack gap="075">
            {FEATURED_MEDALS.map((medal) => (
              <BadgeMedal key={medal.name} emoji={medal.emoji} look={medal.grade} size="xs" />
            ))}
          </HStack>
        </VStack>
      </PreviewCard>
      <PreviewCard icon={Bell} title="다음 뱃지">
        <HStack align="center" gap="100" className="min-w-0">
          <BadgeMedal emoji="🛡️" look={4} size="xs" locked />
          <VStack gap="025" className="min-w-0">
            <Text typography="subtitle2" weight="extrabold" truncate>
              수호자
            </Text>
            <Text typography="body5" weight="bold" className="text-rank-gold">
              골드
            </Text>
          </VStack>
        </HStack>
        <VStack gap="075">
          <span className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <span className="block h-full w-[91%] rounded-full bg-rank-gold" />
          </span>
          <HStack justify="between" gap="075">
            <Text typography="body4" weight="bold" foreground="muted" numeric>
              6회 남음
            </Text>
            <Text typography="body4" weight="bold" foreground="hint" numeric>
              64 / 70
            </Text>
          </HStack>
        </VStack>
      </PreviewCard>
    </>
  );
}
