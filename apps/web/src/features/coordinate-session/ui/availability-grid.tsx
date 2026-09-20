"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, HStack, Text, VStack } from "@trpg/ui";
import { useState } from "react";

import { availabilityQuery } from "@/entities/availability";
import { AppError } from "@/shared/api";
import type { DayColumn, TimeRow } from "@/shared/lib";
import { SLOT_ROW_PX, SlotGrid, toast } from "@/shared/ui";

import { saveAvailability } from "../api/save-availability";
import { useBeforeUnloadWarning } from "../model/use-before-unload-warning";
import { useSlotPainter } from "../model/use-slot-painter";
import { AvailabilitySaveBar } from "./availability-save-bar";
import { cellTone, UNSAVED_SELECTED_TONE } from "./cell-tone";
import { Legend } from "./legend";
import { PrefillNotice } from "./prefill-notice";

interface AvailabilityGridProps {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  savedMine: string[];
  prefill?: { keys: string[]; label: string } | null;
  blocked: string[];
}

const CELL = "touch-none border-b border-l border-b-gray-100 border-l-gray-100";
const STRIPES =
  "repeating-linear-gradient(45deg, var(--color-gray-300) 0 3px, var(--color-gray-200) 3px 6px)";

export function AvailabilityGrid({
  gameId,
  days,
  timeRows,
  savedMine,
  prefill,
  blocked,
}: AvailabilityGridProps) {
  const usePrefill = savedMine.length === 0 && Boolean(prefill?.keys.length);
  const painter = useSlotPainter({
    initial: usePrefill ? prefill!.keys : savedMine,
    saved: savedMine,
    blocked,
  });
  const [prefillNotice, setPrefillNotice] = useState(usePrefill);
  const queryClient = useQueryClient();
  const { mutate, isPending: pending } = useMutation({
    mutationFn: async (keys: string[]) => {
      const result = await saveAvailability(gameId, keys);
      if (result.error) throw new AppError(result.error, result.errorDisplay);
      return keys;
    },
    meta: { errorMessage: "가능 시간을 저장하지 못했습니다" },
    onSuccess: (keys) => {
      painter.markSaved(keys);
      setPrefillNotice(false);
      toast.success("가능 시간을 저장했습니다");
      // 전체 겹침·확정 후보가 같은 캐시를 읽으므로 저장 결과를 다시 받아 반영한다.
      return queryClient.invalidateQueries({ queryKey: availabilityQuery(gameId).queryKey });
    },
  });

  useBeforeUnloadWarning(painter.dirty);

  function renderCell(key: string) {
    if (painter.isBlocked(key)) {
      return (
        <div
          key={key}
          aria-label="다른 확정 세션"
          className={cn(CELL, "cursor-not-allowed")}
          style={{ height: SLOT_ROW_PX, backgroundImage: STRIPES }}
        />
      );
    }
    const tone = cellTone({ selected: painter.selected.has(key), saved: painter.isSaved(key) });
    return (
      <div
        key={key}
        className={cn(CELL, tone)}
        style={{ height: SLOT_ROW_PX }}
        {...painter.cellHandlers(key)}
      />
    );
  }

  function clearPrefill() {
    painter.reset();
    setPrefillNotice(false);
  }

  return (
    <VStack gap="150">
      {prefillNotice && painter.dirty && (
        <PrefillNotice label={prefill!.label} onClear={clearPrefill} />
      )}

      <Text typography="body4" foreground="hint" render={<p />}>
        누르거나 드래그해서 칠하세요. 다시 누르면 지워집니다.
      </Text>

      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />

      <HStack align="center" wrap className="gap-x-150 gap-y-050">
        <Legend swatchClass="bg-primary-600" label="선택" />
        <Legend swatchClass={UNSAVED_SELECTED_TONE} label="미저장" />
        <Legend swatchStyle={{ backgroundImage: STRIPES }} label="다른 확정 세션" />
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
