"use client";

import { cn, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { type DayColumn, formatDateTime, type TimeRow } from "@/shared/lib";
import { SLOT_ROW_PX, SlotGrid } from "@/shared/ui";

import type { AvailabilityEditor } from "../model/use-availability-editor";
import { useSlotFocus } from "../model/use-slot-focus";
import { AvailabilitySaveBar } from "./availability-save-bar";
import { BLOCKED_STRIPES, cellTone, UNSAVED_SELECTED_TONE } from "./cell-tone";
import { Legend } from "./legend";

interface AvailabilityGridProps {
  editor: AvailabilityEditor;
  days: DayColumn[];
  timeRows: TimeRow[];
  // 도움말과 격자 사이에 끼우는 안내(모집 기한 지남 등).
  notice?: ReactNode;
}

const CELL =
  "touch-none rounded-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export function AvailabilityGrid({ editor, days, timeRows, notice }: AvailabilityGridProps) {
  const { painter, pending, save } = editor;
  const focus = useSlotFocus({ days, timeRows, isBlocked: painter.isBlocked });

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
        누르거나 드래그해서 가능한 시간대를 칠해 주세요.
        <br />
        다시 누르면 지워집니다.
      </Text>
      {notice}

      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />

      <HStack align="center" wrap className="gap-x-175 gap-y-050">
        <Legend swatchClass="bg-primary-600" label="선택" />
        <Legend swatchClass={UNSAVED_SELECTED_TONE} label="미저장" />
        <Legend swatchStyle={{ backgroundImage: BLOCKED_STRIPES }} label="다른 확정 세션" />
      </HStack>

      {/* 1100px 이상에서는 요약 패널이 저장·되돌리기를 맡는다. */}
      <div className="desktop:hidden">
        <AvailabilitySaveBar
          selectedCount={painter.selected.size}
          unsavedCount={painter.unsavedCount}
          dirty={painter.dirty}
          pending={pending}
          onReset={painter.reset}
          onSave={save}
        />
      </div>
    </VStack>
  );
}
