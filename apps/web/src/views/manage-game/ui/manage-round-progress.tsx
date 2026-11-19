import { HStack, Progress, Text, VStack } from "@roll-and-call/ui";

interface ManageRoundProgressProps {
  done: number;
  total: number;
  early: boolean;
}

// 다회차 요약 카드 아래의 진행 막대. 모바일에서만 보인다(데스크톱은 오른쪽 패널의 진행 상태가 대신한다).
export function ManageRoundProgress({ done, total, early }: ManageRoundProgressProps) {
  return (
    <VStack gap="075" className="mt-150 border-t border-gray-200 pt-150 desktop:hidden">
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
