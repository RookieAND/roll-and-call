"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { slotIso, type DayColumn, type TimeRow } from "@/shared/lib/slots";
import { saveAvailability } from "../api/save-availability";

type Props = {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  initialMine: string[];
  blocked: string[];
};

export function AvailabilityGrid({
  gameId,
  days,
  timeRows,
  initialMine,
  blocked,
}: Props) {
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const [mine, setMine] = useState<Set<string>>(() => new Set(initialMine));
  const painting = useRef<boolean | null>(null);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stop = () => {
      painting.current = null;
    };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  function apply(key: string) {
    if (blockedSet.has(key)) return;
    setMine((prev) => {
      const next = new Set(prev);
      if (painting.current) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function onDown(e: React.PointerEvent, key: string) {
    if (blockedSet.has(key)) return;
    // release implicit touch capture so pointerenter fires on sibling cells
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    painting.current = !mine.has(key);
    setSaved(false);
    apply(key);
  }

  function save() {
    startTransition(async () => {
      const result = await saveAvailability(gameId, [...mine]);
      if (!result.error) setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white" />
              {days.map((d) => (
                <th
                  key={d.date}
                  className="whitespace-nowrap px-1 font-medium text-gray-600"
                >
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeRows.map((row) => (
              <tr key={row.label}>
                <td className="sticky left-0 z-10 whitespace-nowrap bg-white pr-2 text-right text-gray-400">
                  {row.minute === 0 ? row.label : ""}
                </td>
                {days.map((d) => {
                  const key = slotIso(d.date, row.hour, row.minute);
                  const isBlocked = blockedSet.has(key);
                  const isMine = mine.has(key);
                  return (
                    <td
                      key={key}
                      onPointerDown={(e) => onDown(e, key)}
                      onPointerEnter={() => apply(key)}
                      className={`h-6 w-10 touch-none select-none border border-gray-200 ${
                        isBlocked
                          ? "cursor-not-allowed bg-gray-300"
                          : isMine
                            ? "cursor-pointer bg-green-500"
                            : "cursor-pointer bg-white hover:bg-green-100"
                      }`}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "저장 중..." : "가능 시간 저장"}
        </button>
        <span className="text-sm text-gray-500">선택 {mine.size}칸</span>
        {saved && <span className="text-sm text-green-600">저장됨</span>}
      </div>
      <p className="text-xs text-gray-400">
        드래그로 칠하세요. 회색 칸은 다른 확정 세션과 겹쳐 선택할 수 없어요.
      </p>
    </div>
  );
}
