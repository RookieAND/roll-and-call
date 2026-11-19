import { Switch, Text, VStack } from "@roll-and-call/ui";

import { laterRoundPreview, type LaterRound } from "../model/later-round-preview";

interface LaterRoundsSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  rounds: readonly LaterRound[];
  shiftMs: number;
}

export function LaterRoundsSwitch({ checked, onChange, rounds, shiftMs }: LaterRoundsSwitchProps) {
  const preview = laterRoundPreview({ rounds, shiftMs });
  const showPreview = checked && rounds.length > 0 && shiftMs !== 0;

  return (
    <VStack gap="100">
      <Switch.Root checked={checked} onCheckedChange={onChange}>
        <Switch.Control />
        <Switch.Label>이후 회차도 같이 옮기기</Switch.Label>
      </Switch.Root>
      {showPreview && (
        <VStack gap="050">
          {preview.lines.map((line) => (
            <Text key={line} typography="body4" foreground="muted">
              {line}
            </Text>
          ))}
          {preview.moreCount > 0 && (
            <Text typography="body4" foreground="muted">
              외 {preview.moreCount}개
            </Text>
          )}
          {preview.weekdayChanged && (
            <Text typography="body4" foreground="muted">
              매주 일정 표시도 새 요일로 바뀝니다.
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
}
