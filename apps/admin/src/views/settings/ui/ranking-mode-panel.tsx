"use client";

import {
  RANKING_MODE,
  RANKING_MODE_LABEL,
  type RankingMode,
} from "@roll-and-call/database/servers/model";
import { RadioCard, RadioGroup, Text, VStack } from "@roll-and-call/ui";

import { Panel } from "@/shared/ui";

const MODE_DESCRIPTION: Record<RankingMode, string> = {
  [RANKING_MODE.count]: "참여한 세션이 많은 순서로 순위를 정합니다.",
  [RANKING_MODE.points]:
    "세션과 후기 점수를 더하고 불참 점수를 빼서, 점수가 높은 순서로 순위를 정합니다.",
};

const MODES = [RANKING_MODE.count, RANKING_MODE.points] as const;

interface RankingModePanelProps {
  value: RankingMode;
  savedValue: RankingMode;
  disabled?: boolean;
  onChange: (mode: RankingMode) => void;
}

export function RankingModePanel({
  value,
  savedValue,
  disabled = false,
  onChange,
}: RankingModePanelProps) {
  const changed = value !== savedValue;
  return (
    <Panel title="이 달의 기록 방식" bodyClassName="p-175">
      <VStack gap="125">
        <Text typography="body4" foreground="hint" render={<p />}>
          이 서버의 이 달의 기록 순위를 매기는 방식을 정합니다.
        </Text>
        <RadioGroup
          value={value}
          disabled={disabled}
          aria-label="이 달의 기록 방식"
          onValueChange={(next) => onChange(next as RankingMode)}
          className="grid grid-cols-1 gap-075 sm:grid-cols-2"
        >
          {MODES.map((mode) => (
            <RadioCard.Root key={mode} value={mode}>
              <RadioCard.Title>{RANKING_MODE_LABEL[mode]}</RadioCard.Title>
              <RadioCard.Description>{MODE_DESCRIPTION[mode]}</RadioCard.Description>
              <RadioCard.Indicator />
            </RadioCard.Root>
          ))}
        </RadioGroup>
        {changed && (
          <Text typography="body4" foreground="muted" render={<p />}>
            [변경 저장]을 누르면 이번 달 순위가 바로 {RANKING_MODE_LABEL[value]}로 다시 계산됩니다.
            이미 확정한 지난달 순위는 바뀌지 않습니다.
          </Text>
        )}
      </VStack>
    </Panel>
  );
}
