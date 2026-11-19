import { Button, Collapsible, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import { roundScheduleLines, type RoundScheduleRound } from "../model/round-schedule-lines";

interface RoundScheduleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 「총 6회 · 매주 토 오후 12:00~4:00」
  summary: string;
  rounds: readonly RoundScheduleRound[];
  // 신청 시트에서 넘어온 경우에만 준다. 맨 아래 [신청으로 돌아가기]가 생긴다.
  onBack?: () => void;
}

// 회차 일정을 읽기만 하는 시트. 상세 정보 표와 다회차 신청 시트가 함께 쓰므로 entity에 둔다.
export function RoundScheduleSheet({
  open,
  onOpenChange,
  summary,
  rounds,
  onBack,
}: RoundScheduleSheetProps) {
  const { finished, lines } = roundScheduleLines(rounds);

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Popup className="gap-150">
        <Sheet.Handle />
        <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>회차 일정</Sheet.Title>
        <Text typography="body3" foreground="muted">
          {summary}
        </Text>
        <VStack gap="025" className="max-h-[23rem] overflow-y-auto">
          {finished && (
            <Collapsible.Root defaultOpen={false}>
              <Collapsible.Trigger className="flex min-h-11 w-full cursor-pointer items-center justify-between">
                <Text typography="subtitle2">{finished.label}</Text>
                <ChevronDown size={16} aria-hidden className="text-muted" />
              </Collapsible.Trigger>
              <Collapsible.Panel>
                <Text typography="body3">{finished.detail}</Text>
              </Collapsible.Panel>
            </Collapsible.Root>
          )}
          {lines.map((line) => (
            <HStack key={line.key} gap="100" align="center" className="min-h-11">
              <Text
                typography="body3"
                foreground="hint"
                aria-hidden
                className="w-4 shrink-0 text-center"
              >
                {line.marker}
              </Text>
              <Text typography="body3">{line.text}</Text>
            </HStack>
          ))}
        </VStack>
        {onBack && (
          <Button variant="ghost" size="md" className="self-center" onClick={onBack}>
            신청으로 돌아가기
          </Button>
        )}
      </Sheet.Popup>
    </Sheet.Root>
  );
}
