"use client";

import { Badge, cn, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { Pencil } from "lucide-react";
import { useState } from "react";

import { roundTimeRange } from "@/entities/game";
import { formatDateWeekday, fromKstDateTimeInput } from "@/shared/lib";

import type { LaterRound } from "../model/later-rounds";
import { RoundSpanFields } from "./round-span-fields";

interface RepeatPreviewRowProps {
  roundNo: number;
  row: LaterRound;
  startError?: string;
  endError?: string;
  onChange: (patch: { startAt?: string; endAt?: string }) => void;
}

export function RepeatPreviewRow({
  roundNo,
  row,
  startError,
  endError,
  onChange,
}: RepeatPreviewRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const startsAt = row.startAt ? fromKstDateTimeInput(row.startAt) : null;
  const endsAt = row.endAt ? fromKstDateTimeInput(row.endAt) : null;
  const isShown = !!startsAt && !!endsAt && !Number.isNaN(startsAt.getTime() + endsAt.getTime());
  const hasError = !!startError || !!endError;
  const showsInputs = isEditing || hasError;

  return (
    <VStack
      gap="150"
      className={cn(
        "border-t border-gray-100 py-100 pr-075 pl-175 first:border-t-0",
        row.edited && "bg-tinted-bg",
      )}
    >
      <HStack align="center" gap="150" className="min-h-12">
        <Text
          typography="subtitle2"
          foreground={row.edited ? "primary" : "muted"}
          className="w-10 flex-none"
        >
          {roundNo}회차
        </Text>
        <VStack gap="025" className="min-w-0 flex-1">
          <HStack align="center" gap="075" wrap>
            <Text typography="body3" weight="bold">
              {isShown ? formatDateWeekday(startsAt) : ""}
            </Text>
            {row.edited && <Badge colorPalette="primary">직접 바꾼 일정</Badge>}
          </HStack>
          <Text typography="body4" foreground="muted">
            {isShown ? roundTimeRange({ startsAt, endsAt }) : ""}
          </Text>
        </VStack>
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${roundNo}회차 고치기`}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil size={16} aria-hidden />
        </IconButton>
      </HStack>
      {showsInputs && (
        <div className="pr-100 pb-100">
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
        </div>
      )}
    </VStack>
  );
}
