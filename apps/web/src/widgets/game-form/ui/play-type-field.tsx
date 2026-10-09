"use client";

import { Field, SegmentedControl } from "@roll-and-call/ui";

import { isPlayType, PLAY_TYPES, playTypeLabel, type PlayType } from "@/entities/game";

interface PlayTypeFieldProps {
  value: PlayType;
  onChange: (playType: PlayType) => void;
}

export function PlayTypeField({ value, onChange }: PlayTypeFieldProps) {
  return (
    <Field.Root label="플레이 유형">
      <SegmentedControl.Root
        value={value}
        onValueChange={(next) => {
          if (isPlayType(next)) onChange(next);
        }}
        aria-label="플레이 유형"
      >
        {PLAY_TYPES.map((playType) => (
          <SegmentedControl.Item key={playType} value={playType}>
            {playTypeLabel(playType)}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </Field.Root>
  );
}
