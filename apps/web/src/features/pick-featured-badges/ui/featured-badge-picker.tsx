"use client";

import { BADGE_ROLE, type BadgeRole } from "@roll-and-call/database/badges/model";
import {
  Button,
  Callout,
  Container,
  Grid,
  HStack,
  IconButton,
  Tabs,
  Text,
  VStack,
} from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { BadgeMedal, FEATURED_BADGE_LIMIT } from "@/entities/badge";
import { toast, useAction } from "@/shared/ui";

import { saveFeaturedBadges } from "../api/save-featured-badges";
import type { FeaturedChoice } from "../model/featured-choice";
import { groupChoices } from "../model/group-choices";
import { toggleFeatured } from "../model/toggle-featured";
import { FeaturedGroupCard } from "./featured-group-card";

const TABS = [
  { role: BADGE_ROLE.gm, label: "GM" },
  { role: BADGE_ROLE.player, label: "PL" },
  { role: BADGE_ROLE.special, label: "특별" },
] as const;

interface FeaturedBadgePickerProps {
  choices: FeaturedChoice[];
  initialKeys: string[];
}

export function FeaturedBadgePicker({ choices, initialKeys }: FeaturedBadgePickerProps) {
  const [picked, setPicked] = useState(initialKeys);
  const countByRole = (target: BadgeRole) =>
    choices.filter((choice) => choice.role === target).length;
  const [role, setRole] = useState<BadgeRole>(
    () => TABS.find((tab) => countByRole(tab.role) > 0)?.role ?? BADGE_ROLE.gm,
  );
  const { run, pending } = useAction();
  const full = picked.length >= FEATURED_BADGE_LIMIT;
  const pickedChoices = picked.flatMap((key) => choices.filter((choice) => choice.key === key));

  return (
    <Container
      size="sm"
      className="flex min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-3px)] flex-col px-0"
    >
      <VStack gap="200" className="p-200">
        <HStack align="center" gap="050" className="-my-050 -mr-100">
          <Text typography="heading3" render={<h2 />} className="flex-1">
            대표 뱃지
          </Text>
          <IconButton
            variant="ghost"
            aria-label="대표 뱃지 초기화"
            disabled={picked.length === 0}
            onClick={() => setPicked([])}
          >
            <RotateCcw size={20} aria-hidden />
          </IconButton>
        </HStack>
        <Callout.Root colorPalette="primary">
          <Callout.Icon />
          <Callout.Title>대표 뱃지란</Callout.Title>
          <Callout.Description className="break-keep">
            프로필 이름 아래에 최대 {FEATURED_BADGE_LIMIT}개까지 보입니다.
            <br />
            현재까지 받은 업적 중에서 고를 수 있습니다.
          </Callout.Description>
        </Callout.Root>
        {pickedChoices.length > 0 ? (
          <Grid cols={3} gap="100">
            {pickedChoices.map((choice, index) => (
              <VStack
                key={choice.key}
                align="center"
                gap="150"
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
        ) : null}
      </VStack>
      <div className="border-t-8 border-gray-50" />
      <Tabs.Root value={role} onValueChange={(next) => setRole(next as BadgeRole)}>
        <Tabs.List aria-label="분류" scrollable={false} className="w-full">
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.role}
              value={tab.role}
              disabled={countByRole(tab.role) === 0}
              className="flex-1"
            >
              {tab.label}
              <span className="tabular-nums opacity-72">{countByRole(tab.role)}</span>
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
      <VStack gap="125" className="px-200 pt-200 pb-250">
        {groupChoices({ choices, role }).map((group, index) => (
          <FeaturedGroupCard
            key={`${role}-${group.key}`}
            emoji={group.emoji}
            title={group.title}
            choices={group.choices}
            picked={picked}
            full={full}
            defaultOpen={index === 0}
            onToggle={(key) => setPicked((current) => toggleFeatured({ picked: current, key }))}
          />
        ))}
      </VStack>
      <div className="sticky bottom-(--rc-size-tabbar) z-(--rc-z-sticky) mt-auto border-t border-gray-100 bg-surface px-200 py-150">
        <Button
          size="lg"
          className="w-full"
          disabled={pending}
          onClick={() =>
            run(() => saveFeaturedBadges(picked), {
              onSuccess: () => toast.success("대표 뱃지를 저장했습니다"),
            })
          }
        >
          저장
        </Button>
      </div>
    </Container>
  );
}
