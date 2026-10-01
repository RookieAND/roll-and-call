"use client";

import {
  Avatar,
  Button,
  Chip,
  Container,
  FloatingBar,
  Grid,
  HStack,
  Text,
  VStack,
} from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { BadgeMedal, BadgePill, FEATURED_BADGE_LIMIT } from "@/entities/badge";
import { toast, useAction } from "@/shared/ui";

import { saveFeaturedBadges } from "../api/save-featured-badges";
import type { FeaturedChoice } from "../model/featured-choice";
import { toggleFeatured } from "../model/toggle-featured";

interface FeaturedBadgePickerProps {
  choices: FeaturedChoice[];
  initialKeys: string[];
  name: string;
  avatarUrl: string | null;
}

export function FeaturedBadgePicker({
  choices,
  initialKeys,
  name,
  avatarUrl,
}: FeaturedBadgePickerProps) {
  const [picked, setPicked] = useState(initialKeys);
  const { run, pending } = useAction();
  const full = picked.length >= FEATURED_BADGE_LIMIT;
  const pickedChoices = picked.flatMap((key) => choices.filter((choice) => choice.key === key));

  return (
    <FloatingBar.Root elevated={false}>
      <Container size="sm">
        <VStack gap="200" className="py-200">
          <HStack align="baseline">
            <Text typography="body3" foreground="muted" className="flex-1 [text-wrap:pretty]">
              {FEATURED_BADGE_LIMIT}개까지 고를 수 있습니다. 누른 순서대로 이름 아래에 놓입니다.
            </Text>
            <Text typography="body3" weight="bold" foreground="primary" numeric>
              {picked.length} / {FEATURED_BADGE_LIMIT}
            </Text>
          </HStack>

          <HStack align="center" gap="150" className="rounded-500 bg-gray-50 p-150">
            <Avatar name={name} src={avatarUrl} size="lg" />
            <VStack gap="075" className="min-w-0 flex-1">
              <Text typography="subtitle1" weight="extrabold" truncate>
                {name}
              </Text>
              <HStack wrap gap="050" className="min-h-[26px]">
                {pickedChoices.length > 0 ? (
                  pickedChoices.map((choice) => (
                    <BadgePill
                      key={choice.key}
                      emoji={choice.emoji}
                      name={choice.name}
                      look={choice.look}
                      tag={choice.tag}
                      size="sm"
                    />
                  ))
                ) : (
                  <Text typography="body4" foreground="hint">
                    고르지 않으면 최근에 받은 3개가 보입니다
                  </Text>
                )}
              </HStack>
            </VStack>
          </HStack>

          <Grid cols={4} gap="100">
            {choices.map((choice) => {
              const order = picked.indexOf(choice.key);
              const selected = order >= 0;
              return (
                <Chip
                  key={choice.key}
                  shape="block"
                  selected={selected}
                  aria-pressed={selected}
                  disabled={full && !selected}
                  onClick={() =>
                    setPicked((current) => toggleFeatured({ picked: current, key: choice.key }))
                  }
                  className="relative h-auto flex-col gap-075 rounded-500 px-050 pt-125 pb-100 whitespace-normal"
                >
                  <BadgeMedal emoji={choice.emoji} look={choice.look} ribbon={choice.tag} />
                  <Text
                    typography="body4"
                    weight="extrabold"
                    foreground="inherit"
                    className="mt-050 leading-tight [text-wrap:balance]"
                  >
                    {choice.name}
                  </Text>
                  {selected && (
                    <Text
                      typography="body4"
                      weight="extrabold"
                      foreground="onPrimary"
                      className="absolute top-050 right-050 flex size-5 items-center justify-center rounded-full bg-primary-600"
                    >
                      {order + 1}
                    </Text>
                  )}
                </Chip>
              );
            })}
          </Grid>
        </VStack>
      </Container>
      <FloatingBar.Content>
        <Container size="sm">
          <HStack gap="100">
            <Button
              render={<Link href="/me/badges" />}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={pending}
              onClick={() =>
                run(() => saveFeaturedBadges(picked), {
                  onSuccess: () => toast.success("대표 뱃지를 저장했습니다"),
                })
              }
            >
              저장
            </Button>
          </HStack>
        </Container>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
