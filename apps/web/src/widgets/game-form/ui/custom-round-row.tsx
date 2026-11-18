"use client";

import { HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { Trash2 } from "lucide-react";

import type { LaterRound } from "../model/later-rounds";
import { RoundSpanFields } from "./round-span-fields";

interface CustomRoundRowProps {
  roundNo: number;
  row: LaterRound;
  startError?: string;
  endError?: string;
  onChange: (patch: { startAt?: string; endAt?: string }) => void;
  onRemove: () => void;
}

export function CustomRoundRow({
  roundNo,
  row,
  startError,
  endError,
  onChange,
  onRemove,
}: CustomRoundRowProps) {
  return (
    <VStack gap="100">
      <HStack align="center" justify="between">
        <Text typography="body4" weight="bold">
          {roundNo}회차
        </Text>
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${roundNo}회차 삭제`}
          onClick={onRemove}
        >
          <Trash2 size={16} aria-hidden />
        </IconButton>
      </HStack>
      <RoundSpanFields
        roundNo={roundNo}
        startId={`laterRounds.${roundNo - 2}.startAt`}
        endId={`laterRounds.${roundNo - 2}.endAt`}
        start={row.startAt}
        end={row.endAt}
        startError={startError}
        endError={endError}
        onChangeStart={(startAt) => onChange({ startAt })}
        onChangeEnd={(endAt) => onChange({ endAt })}
      />
    </VStack>
  );
}
