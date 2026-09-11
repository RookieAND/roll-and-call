"use client";

import { Button, Text } from "@trpg/ui";
import { useTransition } from "react";
import type { DayColumn, TimeRow } from "@/shared/lib";
import { SlotGrid, toast } from "@/shared/ui";
import { saveAvailability } from "../api/save-availability";
import { useSlotPainter } from "../model/use-slot-painter";

type Props = {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  initialMine: string[];
  // 다른 확정 세션과 겹쳐 고를 수 없는 칸
  blocked: string[];
  readOnly?: boolean;
};

const CELL = "h-[22px] touch-none border-b border-l border-b-[#F1F1F5] border-l-[#EFEFF3]";

export function AvailabilityGrid({
  gameId,
  days,
  timeRows,
  initialMine,
  blocked,
  readOnly = false,
}: Props) {
  const painter = useSlotPainter({ initial: initialMine, blocked, readOnly });
  const [pending, startTransition] = useTransition();

  function save() {
    const keys = [...painter.selected];
    startTransition(async () => {
      const result = await saveAvailability(gameId, keys);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      painter.markSaved(keys);
      toast.success("가능 시간을 저장했습니다");
    });
  }

  function renderCell(key: string) {
    const blockedCell = painter.isBlocked(key);
    const tone = blockedCell
      ? "cursor-not-allowed bg-[#E9E9EE]"
      : painter.selected.has(key)
        ? "bg-primary-600"
        : readOnly
          ? "bg-surface"
          : "cursor-pointer bg-surface hover:bg-primary-50";

    return <div key={key} className={`${CELL} ${tone}`} {...painter.cellHandlers(key)} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {!readOnly && (
        <Text typography="body4" foreground="muted" render={<p />}>
          클릭하거나 드래그해서 가능한 시간을 칠하세요. 30분 단위, 다시 누르면 지워집니다.
        </Text>
      )}

      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />

      {!readOnly && (
        <>
          <Text typography="body4" foreground="muted" render={<p />}>
            선택 {painter.selected.size}칸 · 회색은 다른 확정 세션과 겹침
          </Text>
          <Button
            type="button"
            size="lg"
            className="h-12 w-full"
            loading={pending}
            disabled={!painter.dirty}
            onClick={save}
          >
            가능 시간 저장
          </Button>
        </>
      )}
    </div>
  );
}
