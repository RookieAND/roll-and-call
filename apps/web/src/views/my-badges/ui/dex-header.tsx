import { Button, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { BadgeMedal, monthLabel, type BadgeView } from "@/entities/badge";

interface DexHeaderProps {
  earnedCount: number;
  featured: BadgeView[];
}

export function DexHeader({ earnedCount, featured }: DexHeaderProps) {
  return (
    <>
      <HStack align="baseline" gap="100" className="border-b-8 border-gray-50 p-200">
        <Text typography="body2" weight="bold" foreground="muted" className="flex-1">
          받은 업적
        </Text>
        <Text typography="heading1" numeric>
          {earnedCount}개
        </Text>
      </HStack>
      <VStack gap="150" className="border-b-8 border-gray-50 p-200">
        <HStack align="center" gap="150">
          <VStack gap="025" className="min-w-0 flex-1">
            <Text typography="heading3" render={<h2 />}>
              대표 뱃지
            </Text>
            <Text typography="body4" foreground="hint" className="[text-wrap:pretty]">
              프로필 이름 아래에 이 순서로 보입니다.
            </Text>
          </VStack>
          <Button render={<Link href="/me/badges/featured" />} variant="outline" size="sm">
            바꾸기
          </Button>
        </HStack>
        {featured.length > 0 ? (
          <Grid cols={3} gap="100" render={<ol />}>
            {featured.map((badge, index) => (
              <VStack
                key={badge.key}
                align="center"
                gap="125"
                render={<li />}
                className="relative rounded-500 bg-gray-50 px-075 pt-175 pb-150 text-center"
              >
                <Text
                  typography="body4"
                  weight="extrabold"
                  foreground="hint"
                  numeric
                  className="absolute top-100 left-125"
                >
                  {index + 1}
                </Text>
                <BadgeMedal
                  emoji={badge.emoji}
                  look={badge.look}
                  ribbon={badge.monthKey ? monthLabel(badge.monthKey) : null}
                />
                <Text
                  typography="body4"
                  weight="extrabold"
                  className="leading-tight [text-wrap:balance]"
                >
                  {badge.name}
                </Text>
              </VStack>
            ))}
          </Grid>
        ) : (
          <Text typography="body4" foreground="hint">
            첫 세션을 마치면 뱃지를 받습니다
          </Text>
        )}
      </VStack>
    </>
  );
}
