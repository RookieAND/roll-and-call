"use client";

import { SegmentedControl, Text, VStack } from "@roll-and-call/ui";

import { GAME_ROUNDS, type GameRounds } from "../model/game-sort";

const ALL = "all";

const OPTIONS = [
  { key: ALL, label: "전체" },
  { key: GAME_ROUNDS.once, label: "한 번" },
  { key: GAME_ROUNDS.multi, label: "여러 번" },
] as const;

interface RoundsFieldProps {
  value: GameRounds | undefined;
  onChange: (rounds: GameRounds | undefined) => void;
}

export function RoundsField({ value, onChange }: RoundsFieldProps) {
  return (
    <VStack gap="100" render={<section />} aria-label="진행 횟수">
      <Text typography="subtitle2" render={<h3 />}>
        진행 횟수
      </Text>
      <SegmentedControl.Root
        value={value ?? ALL}
        onValueChange={(next) =>
          onChange(Object.values(GAME_ROUNDS).find((rounds) => rounds === next))
        }
        aria-label="진행 횟수"
      >
        {OPTIONS.map((option) => (
          <SegmentedControl.Item key={option.key} value={option.key}>
            {option.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </VStack>
  );
}
