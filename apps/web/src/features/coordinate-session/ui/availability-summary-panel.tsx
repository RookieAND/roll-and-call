import { Badge, Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { DayColumn, TimeRow } from "@/shared/lib";

import { availabilityChanges } from "../model/availability-changes";
import { availabilityTotalText } from "../model/availability-total-text";
import { dayRangesText } from "../model/day-ranges-text";
import type { AvailabilityEditor } from "../model/use-availability-editor";
import { AvailabilityChangeList } from "./availability-change-list";
import { AvailabilityDayList } from "./availability-day-list";

interface AvailabilitySummaryPanelProps {
  editor: AvailabilityEditor;
  days: DayColumn[];
  timeRows: TimeRow[];
}

// 1100px 이상 「내 가능 시간」 탭 오른쪽 패널. 모바일 하단 막대 대신 저장·되돌리기를 맡는다.
export function AvailabilitySummaryPanel({
  editor,
  days,
  timeRows,
}: AvailabilitySummaryPanelProps) {
  const { painter, pending, save } = editor;
  const filledDays = days
    .map((day) => ({
      day,
      ranges: dayRangesText({
        date: day.date,
        timeRows,
        isIncluded: (key) => painter.selected.has(key),
      }),
    }))
    .filter(({ ranges }) => ranges !== "");
  const changes = availabilityChanges({
    days,
    timeRows,
    selected: painter.selected,
    saved: painter.saved,
  });

  return (
    <Card.Root background="subtle" render={<section />}>
      <VStack gap="175">
        <HStack align="center" gap="100">
          <Text typography="subtitle1" className="min-w-0 flex-1" render={<h2 />}>
            내 가능 시간
          </Text>
          {painter.dirty ? (
            <Badge colorPalette="warning">저장 안 함 {painter.unsavedCount}칸</Badge>
          ) : (
            <Badge colorPalette="success">저장됨</Badge>
          )}
        </HStack>
        <Text typography="heading3" weight="extrabold" numeric render={<p />}>
          {availabilityTotalText({
            dayCount: days.length,
            filledDayCount: filledDays.length,
            slotCount: painter.selected.size,
          })}
        </Text>
        {filledDays.length > 0 && <AvailabilityDayList days={filledDays} />}
        {changes.length > 0 && <AvailabilityChangeList changes={changes} />}
        <HStack gap="100">
          <Button
            type="button"
            variant="outline"
            colorPalette="gray"
            size="md"
            className="min-w-0 flex-1"
            disabled={!painter.dirty}
            onClick={painter.reset}
          >
            되돌리기
          </Button>
          <Button
            type="button"
            size="md"
            className="min-w-0 flex-1"
            loading={pending}
            disabled={!painter.dirty}
            onClick={save}
          >
            저장
          </Button>
        </HStack>
        <Text typography="body4" foreground="hint" className="text-pretty" render={<p />}>
          방향키로 칸을 옮기고 Space로 칠할 수 있습니다.
        </Text>
      </VStack>
    </Card.Root>
  );
}
