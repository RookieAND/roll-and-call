import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { BadgePill, monthLabel, type BadgeView } from "@/entities/badge";

interface DexHeaderProps {
  earnedCount: number;
  featured: BadgeView[];
}

export function DexHeader({ earnedCount, featured }: DexHeaderProps) {
  return (
    <VStack gap="150" className="px-200 pt-200 pb-175">
      <HStack align="baseline" gap="100">
        <Text typography="body4" weight="bold" foreground="muted">
          받은 업적
        </Text>
        <Text typography="heading1" numeric>
          {earnedCount}개
        </Text>
      </HStack>
      <VStack gap="100" className="rounded-500 bg-gray-50 p-150">
        <HStack align="center">
          <Text typography="body4" weight="bold" foreground="muted" className="flex-1">
            대표 뱃지 · 프로필 이름 아래에 보입니다
          </Text>
          <Button
            render={<Link href="/me/badges/featured" />}
            variant="ghost"
            colorPalette="primary"
            size="sm"
          >
            고르기
          </Button>
        </HStack>
        {featured.length > 0 ? (
          <HStack wrap gap="075">
            {featured.map((badge) => (
              <BadgePill
                key={badge.key}
                emoji={badge.emoji}
                name={badge.name}
                grade={badge.grade}
                tag={badge.monthKey ? monthLabel(badge.monthKey) : null}
              />
            ))}
          </HStack>
        ) : (
          <Text typography="body4" foreground="hint">
            첫 세션을 마치면 뱃지를 받습니다
          </Text>
        )}
      </VStack>
    </VStack>
  );
}
