"use client";

import { Avatar, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal, FEATURED_BADGE_LIMIT } from "@/entities/badge";

import type { FeaturedChoice } from "../model/featured-choice";
import { useFeaturedPick } from "./use-featured-pick";

interface FeaturedPreviewPanelProps {
  choices: FeaturedChoice[];
  name: string;
  avatarUrl: string | null;
}

export function FeaturedPreviewPanel({ choices, name, avatarUrl }: FeaturedPreviewPanelProps) {
  const { picked } = useFeaturedPick();
  const pickedChoices = picked.flatMap((key) => choices.filter((choice) => choice.key === key));

  return (
    <VStack gap="150" className="overflow-clip rounded-700 border border-gray-200 bg-surface p-200">
      <Text typography="heading3" render={<h2 />}>
        프로필 미리보기
      </Text>
      <HStack align="center" gap="125">
        <Avatar src={avatarUrl} name={name} size="lg" />
        <Text typography="subtitle1" weight="extrabold" truncate className="min-w-0">
          {name}
        </Text>
      </HStack>
      {pickedChoices.length > 0 ? (
        <Grid cols={3} gap="100" render={<ol />}>
          {pickedChoices.map((choice, index) => (
            <VStack
              key={choice.key}
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
              <BadgeMedal emoji={choice.emoji} look={choice.look} ribbon={choice.tag} size="md" />
              <Text typography="body4" weight="extrabold" className="leading-tight text-balance">
                {choice.name}
              </Text>
            </VStack>
          ))}
        </Grid>
      ) : (
        <Text typography="body4" foreground="hint">
          고르지 않으면 대표 뱃지가 보이지 않습니다
        </Text>
      )}
      <Text typography="body4" foreground="hint">
        {picked.length} / {FEATURED_BADGE_LIMIT} 선택 · 저장하면 프로필에 바로 반영됩니다
      </Text>
    </VStack>
  );
}
