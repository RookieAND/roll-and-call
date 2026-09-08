"use client";

import { Button, Text } from "@trpg/ui";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "@/shared/ui";
import { slotIso, type DayColumn, type TimeRow } from "@/shared/lib";
import { saveAvailability } from "../api/save-availability";

type Props = {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  initialMine: string[];
  blocked: string[];
  readOnly?: boolean;
};

export function AvailabilityGrid({
  gameId,
  days,
  timeRows,
  initialMine,
  blocked,
  readOnly = false,
}: Props) {
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const [mine, setMine] = useState<Set<string>>(() => new Set(initialMine));
  // 마지막으로 저장된 상태. 변경이 없으면 저장 버튼을 잠근다.
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initialMine));
  const dirty = mine.size !== saved.size || [...mine].some((k) => !saved.has(k));
  const painting = useRef<boolean | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const stop = () => {
      painting.current = null;
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  function apply(key: string) {
    if (readOnly || blockedSet.has(key) || painting.current === null) return;
    setMine((prev) => {
      const next = new Set(prev);
      if (painting.current) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function onDown(e: React.PointerEvent, key: string) {
    if (readOnly || blockedSet.has(key)) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    painting.current = !mine.has(key);
    apply(key);
  }

  function save() {
    startTransition(async () => {
      const result = await saveAvailability(gameId, [...mine]);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setSaved(new Set(mine));
      toast.success("가능 시간을 저장했습니다");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {!readOnly && (
        <Text typography="body4" foreground="muted" render={<p />}>
          클릭하거나 드래그해서 가능한 시간을 칠하세요. 30분 단위, 다시 누르면 지워집니다.
        </Text>
      )}
      <div className="overflow-x-auto">
        <div
          className="grid min-w-full select-none"
          style={{
            gridTemplateColumns: `40px repeat(${days.length}, minmax(0, 1fr))`,
          }}
        >
          <span />
          {days.map((d) => (
            <div key={d.date} className="flex flex-col items-center pb-1">
              <Text typography="body4" foreground="hint" render={<span />}>
                {d.dow}
              </Text>
              <Text typography="subtitle2" render={<span />}>
                {d.md}
              </Text>
            </div>
          ))}

          {timeRows.map((row) => [
            <Text
              key={`${row.label}-t`}
              typography="subtitle2"
              foreground="hint"
              render={<span />}
              className="pr-1.5 text-right"
            >
              {row.minute === 0 ? row.label : ""}
            </Text>,
            ...days.map((d) => {
              const key = slotIso(d.date, row.hour, row.minute);
              const isBlocked = blockedSet.has(key);
              const isMine = mine.has(key);
              return (
                <div
                  key={key}
                  onPointerDown={(e) => onDown(e, key)}
                  onPointerEnter={(e) => {
                    if (e.buttons !== 0) apply(key);
                  }}
                  className={`h-[22px] touch-none border-b border-l border-b-[#F1F1F5] border-l-[#EFEFF3] ${
                    isBlocked
                      ? "cursor-not-allowed bg-[#E9E9EE]"
                      : isMine
                        ? "bg-primary-600"
                        : readOnly
                          ? "bg-surface"
                          : "cursor-pointer bg-surface hover:bg-primary-50"
                  }`}
                />
              );
            }),
          ])}
        </div>
      </div>
      {!readOnly && (
        <>
          <Text typography="body4" foreground="muted" render={<p />}>
            선택 {mine.size}칸 · 회색은 다른 확정 세션과 겹침
          </Text>
          <Button
            type="button"
            size="lg"
            className="h-12 w-full"
            loading={pending}
            disabled={!dirty}
            onClick={save}
          >
            가능 시간 저장
          </Button>
        </>
      )}
    </div>
  );
}
