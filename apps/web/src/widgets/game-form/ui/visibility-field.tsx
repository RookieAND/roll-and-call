"use client";

import { Button, Field, SegmentedControl, Text, VStack } from "@roll-and-call/ui";

import { GAME_VISIBILITY, type GameVisibility } from "@/entities/game";

interface VisibilityFieldProps {
  value: GameVisibility;
  onChange: (visibility: GameVisibility) => void;
  // 지정한 참여자가 정원을 채운 공개 구인에만 비공개 제안을 한다.
  suggestsPrivate?: boolean;
  // 수정에서 바꿀 수 없을 때 흐리게 두고 이유를 적는다.
  lockedReason?: string | null;
  locked?: boolean;
}

const PUBLIC_LINES = ["구인방에 모집 글이 올라가고 누구나 신청할 수 있습니다."];
const PRIVATE_LINES = [
  "구인방에 올라가지 않고 신청을 받지 않습니다.",
  "지정한 참여자만 참여합니다.",
];
const SUGGEST_LINES = ["지정한 참여자가 정원을 채웠습니다.", "지정 모집으로 등록할 수 있습니다."];

// 설명은 선택지 아래 한 곳에만 둔다.
export function VisibilityField({
  value,
  onChange,
  suggestsPrivate = false,
  lockedReason = null,
  locked = false,
}: VisibilityFieldProps) {
  const lines = value === GAME_VISIBILITY.private ? PRIVATE_LINES : PUBLIC_LINES;
  const showsSuggestion = suggestsPrivate && value === GAME_VISIBILITY.public;

  return (
    <VStack gap="100">
      <Field.Root label="모집 유형" required>
        <SegmentedControl.Root
          value={value}
          onValueChange={(next) => {
            if (next === GAME_VISIBILITY.public || next === GAME_VISIBILITY.private) onChange(next);
          }}
          disabled={locked}
          aria-label="모집 유형"
          className={locked ? "opacity-50" : undefined}
        >
          <SegmentedControl.Item value={GAME_VISIBILITY.public}>일반 모집</SegmentedControl.Item>
          <SegmentedControl.Item value={GAME_VISIBILITY.private}>지정 모집</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Field.Root>
      <Text typography="body5" foreground="hint" render={<p />}>
        {lockedReason ??
          lines.map((line) => (
            <span key={line} className="block break-keep text-pretty">
              {line}
            </span>
          ))}
      </Text>
      {showsSuggestion && (
        <div className="flex flex-wrap items-center gap-100">
          <Text typography="body5" foreground="muted" render={<p />} className="min-w-50 flex-1">
            {SUGGEST_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Text>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11 px-050"
            onClick={() => onChange(GAME_VISIBILITY.private)}
          >
            지정 모집으로 바꾸기
          </Button>
        </div>
      )}
    </VStack>
  );
}
