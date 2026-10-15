"use client";

import { cn, HStack, Text, VStack } from "@roll-and-call/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { availabilityQuery } from "@/entities/availability";
import { AppError } from "@/shared/api";
import { type DayColumn, formatDateTime, type TimeRow, useBeforeUnloadWarning } from "@/shared/lib";
import { SLOT_ROW_PX, SlotGrid, toast } from "@/shared/ui";

import { saveAvailability } from "../api/save-availability";
import { useSlotFocus } from "../model/use-slot-focus";
import { useSlotPainter } from "../model/use-slot-painter";
import { AvailabilitySaveBar } from "./availability-save-bar";
import { BLOCKED_STRIPES, cellTone, UNSAVED_SELECTED_TONE } from "./cell-tone";
import { Legend } from "./legend";

interface AvailabilityGridProps {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  savedMine: string[];
  blocked: string[];
}

const CELL =
  "touch-none rounded-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export function AvailabilityGrid({
  gameId,
  days,
  timeRows,
  savedMine,
  blocked,
}: AvailabilityGridProps) {
  const painter = useSlotPainter({ initial: savedMine, saved: savedMine, blocked });
  const focus = useSlotFocus({ days, timeRows, isBlocked: painter.isBlocked });
  const queryClient = useQueryClient();
  const { server } = useParams<{ server: string }>();
  const { mutate, isPending: pending } = useMutation({
    mutationFn: async (keys: string[]) => {
      const result = await saveAvailability({ gameId, slotIsos: keys });
      if (result.error) throw new AppError(result.error, result.errorDisplay);
      return keys;
    },
    meta: { errorMessage: "가능 시간을 저장하지 못했습니다" },
    onSuccess: (keys) => {
      painter.markSaved(keys);
      toast.success("가능 시간을 저장했습니다");
      // 전체 겹침·확정 후보가 같은 캐시를 읽으므로 저장 결과를 다시 받아 반영한다.
      return queryClient.invalidateQueries({
        queryKey: availabilityQuery({ slug: server, gameId }).queryKey,
      });
    },
  });

  useBeforeUnloadWarning(painter.dirty);

  function renderCell(key: string) {
    if (painter.isBlocked(key)) {
      return (
        <div
          key={key}
          role="img"
          aria-label="다른 확정 세션"
          className={cn(CELL, "cursor-not-allowed")}
          style={{ height: SLOT_ROW_PX, backgroundImage: BLOCKED_STRIPES }}
        />
      );
    }
    const tone = cellTone({ selected: painter.selected.has(key), saved: painter.isSaved(key) });
    // ponytail: 끌어 칠하는 격자 칸이라 Button 대신 직접 그린다.
    return (
      <button
        key={key}
        type="button"
        aria-label={formatDateTime(key)}
        aria-pressed={painter.selected.has(key)}
        data-slot-key={key}
        tabIndex={key === focus.tabKey ? 0 : -1}
        className={cn(CELL, tone)}
        style={{ height: SLOT_ROW_PX }}
        // detail 0은 Space·Enter로 일어난 클릭이다. 포인터는 pointerdown에서 이미 칠했다.
        onClick={(event) => {
          if (event.detail === 0) painter.toggle(key);
        }}
        onFocus={(event) => focus.onFocus(event, key)}
        onKeyDown={(event) => focus.onKeyDown(event, key)}
        {...painter.cellHandlers(key)}
      />
    );
  }

  return (
    <VStack gap="150">
      <Text typography="body4" foreground="hint" render={<p />}>
        누르거나 드래그해서 가능한 시간대를 칠해 주세요. 다시 누르면 지워집니다.
      </Text>

      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />

      <HStack align="center" wrap className="gap-x-175 gap-y-050">
        <Legend swatchClass="bg-primary-600" label="선택" />
        <Legend swatchClass={UNSAVED_SELECTED_TONE} label="미저장" />
        <Legend swatchStyle={{ backgroundImage: BLOCKED_STRIPES }} label="다른 확정 세션" />
      </HStack>

      <AvailabilitySaveBar
        selectedCount={painter.selected.size}
        unsavedCount={painter.unsavedCount}
        dirty={painter.dirty}
        pending={pending}
        onReset={painter.reset}
        onSave={() => mutate([...painter.selected])}
      />
    </VStack>
  );
}
