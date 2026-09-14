"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// 드래그로 칸을 칠하는 상호작용. 처음 누른 칸의 반대 상태가 그 드래그의 모드(칠하기/지우기)가
// 되고, 포인터를 떼면 끝난다. 잠긴 칸(blocked)과 읽기 전용일 때는 아무것도 하지 않는다.
// initial(처음 칠해진 칸)과 saved(저장된 칸)를 따로 받아, 프로필 기본 시간대처럼 "칠했지만 저장 전"인 상태를 만든다.
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
  // 마지막으로 저장된 상태. 지금 선택과 다르면 저장 버튼이 열린다.
  const [saved, setSaved] = useState<Set<string>>(() => new Set(savedInitial));
  const mode = useRef<boolean | null>(null);

  // 그리드 밖에서 손을 떼도 드래그가 끝나야 한다.
  useEffect(() => {
    const stop = () => {
      mode.current = null;
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  function paint(key: string) {
    if (readOnly || blockedSet.has(key) || mode.current === null) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (mode.current) next.add(key);
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
    mode.current = !selected.has(key);
    paint(key);
  }

  // 저장된 상태와 다른 칸(새로 칠함 + 새로 지움)
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
    // 되돌리기: 마지막으로 저장된 상태로
    reset: () => setSelected(new Set(saved)),
    cellHandlers: (key: string) => ({
      onPointerDown: (event: React.PointerEvent) => start(event, key),
      onPointerEnter: (event: React.PointerEvent) => {
        if (event.buttons !== 0) paint(key);
      },
    }),
  };
}
