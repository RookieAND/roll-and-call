"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// 드래그로 칸을 칠하는 상호작용. 처음 누른 칸의 반대 상태가 그 드래그의 모드(칠하기/지우기)가
// 되고, 포인터를 떼면 끝난다. 잠긴 칸(blocked)과 읽기 전용일 때는 아무것도 하지 않는다.
export function useSlotPainter({
  initial,
  blocked,
  readOnly,
}: {
  initial: string[];
  blocked: string[];
  readOnly: boolean;
}) {
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));
  // 마지막으로 저장된 상태. 지금 선택과 다르면 저장 버튼이 열린다.
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initial));
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

  const dirty = selected.size !== saved.size || [...selected].some((key) => !saved.has(key));

  return {
    selected,
    dirty,
    isBlocked: (key: string) => blockedSet.has(key),
    markSaved: (keys: Iterable<string>) => setSaved(new Set(keys)),
    cellHandlers: (key: string) => ({
      onPointerDown: (event: React.PointerEvent) => start(event, key),
      onPointerEnter: (event: React.PointerEvent) => {
        if (event.buttons !== 0) paint(key);
      },
    }),
  };
}
