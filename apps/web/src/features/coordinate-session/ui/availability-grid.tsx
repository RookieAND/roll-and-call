"use client";

import { Button, Text, cn } from "@trpg/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { availabilityQuery } from "@/entities/availability";
import type { DayColumn, TimeRow } from "@/shared/lib";
import { SLOT_ROW_PX, SlotGrid, toast } from "@/shared/ui";
import { saveAvailability } from "../api/save-availability";
import { useSlotPainter } from "../model/use-slot-painter";

type Props = {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  // 이미 저장된 내 가능 시간
  savedMine: string[];
  // 저장된 게 없을 때 미리 칠해 둘 칸(프로필 기본 가능 시간대). 저장 전 상태로 들어간다.
  prefill?: { keys: string[]; label: string } | null;
  // 다른 확정 세션과 겹쳐 고를 수 없는 칸(그 세션의 플레이타임 길이만큼)
  blocked: string[];
};

const CELL = "touch-none border-b border-l border-b-gray-100 border-l-gray-100";
const STRIPES =
  "repeating-linear-gradient(45deg, var(--color-gray-300) 0 4px, var(--color-gray-200) 4px 8px)";

// 칸 상태별 모양: 선택(저장됨) / 선택(저장 전) / 지웠지만 저장 전 / 빈 칸.
function cellTone({ selected, saved }: { selected: boolean; saved: boolean }) {
  if (selected && saved) return "bg-primary-600";
  if (selected) return "bg-primary-300 shadow-[inset_0_0_0_2px_var(--color-surface)]";
  if (saved) return "bg-surface shadow-[inset_0_0_0_2px_var(--color-primary-300)]";
  return "cursor-pointer bg-surface hover:bg-primary-50";
}

// 내 가능 시간 격자. 칠한 칸이 저장 전인지 보이게 하고, 하단 바의 "저장"으로만 전달한다.
export function AvailabilityGrid({ gameId, days, timeRows, savedMine, prefill, blocked }: Props) {
  const usePrefill = savedMine.length === 0 && Boolean(prefill?.keys.length);
  const painter = useSlotPainter({
    initial: usePrefill ? prefill!.keys : savedMine,
    saved: savedMine,
    blocked,
  });
  const [prefillNotice, setPrefillNotice] = useState(usePrefill);
  const queryClient = useQueryClient();
  const { mutate, isPending: pending } = useMutation({
    mutationFn: (keys: string[]) => saveAvailability(gameId, keys),
    onSuccess: (result, keys) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      painter.markSaved(keys);
      setPrefillNotice(false);
      toast.success("가능 시간을 저장했습니다");
      // 전체 겹침·확정 후보가 같은 캐시를 읽으므로 저장 결과를 다시 받아 반영한다.
      return queryClient.invalidateQueries({ queryKey: availabilityQuery(gameId).queryKey });
    },
    onError: () => toast.error("가능 시간을 저장하지 못했습니다"),
  });

  // 저장하지 않은 칠하기가 있으면 탭을 닫거나 새로고침할 때 브라우저가 한 번 묻는다.
  useEffect(() => {
    if (!painter.dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [painter.dirty]);

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

  const status = painter.dirty ? `저장하지 않음 ${painter.unsavedCount}칸` : "모두 저장됨";

  return (
    <div className="flex flex-col gap-3">
      {prefillNotice && painter.dirty && (
        <div className="flex items-start gap-2 rounded-xl bg-tinted-bg px-3.5 py-3">
          <Text typography="body4" render={<p />} className="flex-1 text-tinted-ink">
            프로필의 기본 가능 시간대({prefill!.label})를 미리 칠해뒀습니다. 아래 &quot;저장&quot;을 눌러야 GM에게
            전달됩니다.
          </Text>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 shrink-0"
            onClick={() => {
              painter.reset();
              setPrefillNotice(false);
            }}
          >
            지우기
          </Button>
        </div>
      )}

      <Text typography="body4" foreground="hint" render={<p />}>
        누르거나 드래그해서 칠하세요. 다시 누르면 지워집니다.
      </Text>

      <SlotGrid days={days} timeRows={timeRows} renderCell={renderCell} />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Legend swatchClass="bg-primary-600" label="선택" />
        <Legend swatchClass="bg-primary-300 shadow-[inset_0_0_0_2px_var(--color-surface)]" label="미저장" />
        <Legend swatchStyle={{ backgroundImage: STRIPES }} label="다른 확정 세션" />
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-2 border-t border-gray-200 bg-surface px-4 py-3">
        <Text typography="body3" render={<p />} className="min-w-0 flex-1 tabular-nums">
          선택 {painter.selected.size}칸 ·{" "}
          <span className={painter.dirty ? "font-semibold text-warning-600" : "text-hint"}>{status}</span>
        </Text>
        {painter.dirty && (
          <Button variant="ghost" size="sm" className="h-10 shrink-0" onClick={painter.reset}>
            되돌리기
          </Button>
        )}
        <Button
          type="button"
          className="h-11 shrink-0 px-6"
          loading={pending}
          disabled={!painter.dirty}
          onClick={() => mutate([...painter.selected])}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

function Legend({
  label,
  swatchClass,
  swatchStyle,
}: {
  label: string;
  swatchClass?: string;
  swatchStyle?: React.CSSProperties;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn("inline-block size-3.5 rounded-[3px] border border-gray-200", swatchClass)}
        style={swatchStyle}
      />
      <Text typography="body4" foreground="muted" render={<span />}>
        {label}
      </Text>
    </span>
  );
}
