"use client";

import { Button, Field, IconButton, Text, VStack } from "@roll-and-call/ui";

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
      <VStack gap="100">
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
              <IconButton aria-label="최대 지우기" onClick={() => onChangeMax(null)}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </IconButton>
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
