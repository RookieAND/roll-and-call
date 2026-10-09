"use client";

import { Field, HStack, SegmentedControl, Text, VStack } from "@roll-and-call/ui";
import { Lock } from "lucide-react";

import { GAME_KINDS, gameKindLabel, isGameKind, type GameKind } from "@/entities/game";

interface GameKindFieldProps {
  value: GameKind;
  onChange: (kind: GameKind) => void;
  locked?: boolean;
}

export function GameKindField({ value, onChange, locked = false }: GameKindFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="구분" required>
        <SegmentedControl.Root
          value={value}
          onValueChange={(next) => {
            if (isGameKind(next)) onChange(next);
          }}
          disabled={locked}
          aria-label="구분"
        >
          {GAME_KINDS.map((kind) => (
            <SegmentedControl.Item key={kind} value={kind}>
              {gameKindLabel(kind)}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Field.Root>
      {locked && (
        <HStack align="center" gap="075">
          <Lock size={15} strokeWidth={2.2} aria-hidden className="flex-none text-hint" />
          <Text typography="body3" foreground="muted">
            신청자가 생겨 구분을 바꿀 수 없어요
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
