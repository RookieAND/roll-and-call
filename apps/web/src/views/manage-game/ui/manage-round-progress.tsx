import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface ManageRoundProgressProps {
  done: number;
  total: number;
  early: boolean;
}

// 다회차 요약 카드의 진행 막대. 단발의 단계 표시 대신 마친 회차 수를 보인다.
export function ManageRoundProgress({ done, total, early }: ManageRoundProgressProps) {
  return (
    <VStack gap="075" className="mt-150">
      <HStack justify="between" align="baseline">
        <Text typography="body4" foreground="muted">
          진행한 회차
        </Text>
        <Text typography="subtitle2" className="tabular-nums">
          {done} / {total}회
        </Text>
      </HStack>
      <Progress
        value={done}
        max={total}
        colorPalette={early ? "gray" : "primary"}
        aria-label="진행한 회차"
      />
    </VStack>
  );
}
