"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// initial과 saved를 따로 받아 프로필 기본 시간대처럼 "칠했지만 저장 전"인 상태를 만든다.
export function useSlotPainter({
  initial,
  saved: savedInitial,
  blocked,
  readOnly = false,
}: {
  initial: string[];
  saved: string[];
  blocked: string[];
  readOnly?: boolean;
}) {
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));
  const [saved, setSaved] = useState<Set<string>>(() => new Set(savedInitial));
  const paintMode = useRef<boolean | null>(null);

  // 그리드 밖에서 손을 떼도 드래그가 끝나야 한다.
  useEffect(() => {
    const stop = () => {
      paintMode.current = null;
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  function paint(key: string) {
    if (readOnly || blockedSet.has(key) || paintMode.current === null) return;
    setSelected((previous) => {
      const next = new Set(previous);
      if (paintMode.current) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function start(event: React.PointerEvent, key: string) {
    if (readOnly || blockedSet.has(key)) return;
    // 포인터 캡처를 놓아야 드래그가 옆 칸으로 이어진다.
    try {
      (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    } catch {
      /* no-op */
    }
    paintMode.current = !selected.has(key);
    paint(key);
  }

  let unsavedCount = 0;
  for (const key of selected) if (!saved.has(key)) unsavedCount++;
  for (const key of saved) if (!selected.has(key)) unsavedCount++;

  return {
    selected,
    dirty: unsavedCount > 0,
    unsavedCount,
    isSaved: (key: string) => saved.has(key),
    isBlocked: (key: string) => blockedSet.has(key),
    markSaved: (keys: Iterable<string>) => setSaved(new Set(keys)),
    reset: () => setSelected(new Set(saved)),
    cellHandlers: (key: string) => ({
      onPointerDown: (event: React.PointerEvent) => start(event, key),
      onPointerEnter: (event: React.PointerEvent) => {
        if (event.buttons !== 0) paint(key);
      },
    }),
  };
}
