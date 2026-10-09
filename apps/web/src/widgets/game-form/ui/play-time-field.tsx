"use client";

import { Button, Field, Text, VStack } from "@roll-and-call/ui";

import { PlayTimeRow } from "./play-time-row";

interface PlayTimeFieldProps {
  min: number;
  max: number | null;
  onChangeMin: (minutes: number) => void;
  onChangeMax: (minutes: number | null) => void;
  error?: string;
}

export function PlayTimeField({ min, max, onChangeMin, onChangeMax, error }: PlayTimeFieldProps) {
  return (
    <Field.Root label="플레이타임" required>
      <VStack gap="150">
        <PlayTimeRow name={max === null ? undefined : "최소"} value={min} onChange={onChangeMin} />
        {max === null ? (
          <Button
            type="button"
            variant="outline"
            colorPalette="gray"
            className="h-11 w-full"
            onClick={() => onChangeMax(min)}
          >
            + 최대 추가
          </Button>
        ) : (
          <PlayTimeRow
            name="최대"
            value={max}
            onChange={onChangeMax}
            action={
              <Button
                type="button"
                variant="ghost"
                colorPalette="gray"
                size="sm"
                onClick={() => onChangeMax(null)}
              >
                지우기
              </Button>
            }
          />
        )}
        {error && (
          <Text role="alert" typography="body4" foreground="danger">
            {error}
          </Text>
        )}
        {!error && max === null && (
          <Text typography="body4" foreground="hint">
            최대를 추가하지 않으면 최소와 같은 시간으로 정해집니다.
          </Text>
        )}
      </VStack>
    </Field.Root>
  );
}
