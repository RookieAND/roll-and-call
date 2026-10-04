"use client";

import { isNull } from "es-toolkit";
import { useEffect, useRef, useState } from "react";

import { photoIndexAt } from "./photo-index-at";

const LONG_PRESS_MS = 400;
const MOVE_TOLERANCE_PX = 8;

// 휴대폰에서 사진을 400ms 길게 누른 뒤 끌면 놓은 칸으로 옮긴다. 데스크톱은 HTML5 드래그가 맡는다.
// ponytail: 끄는 동안 화면이 스크롤되지 않게 하려면 passive가 아닌 touchmove가 필요해 포인터 대신 터치 이벤트를 직접 단다.
export function useLongPressReorder({ onMove }: { onMove: (from: number, to: number) => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const onMoveRef = useRef(onMove);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  useEffect(() => {
    onMoveRef.current = onMove;
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let from: number | null = null;
    let start = { x: 0, y: 0 };

    function reset() {
      clearTimeout(timer);
      from = null;
      setPressedIndex(null);
    }

    function handleStart(event: TouchEvent) {
      const touch = event.touches[0];
      if (event.touches.length !== 1 || !touch || !grid) return;
      const index = photoIndexAt({ grid, x: touch.clientX, y: touch.clientY });
      if (isNull(index)) return;
      start = { x: touch.clientX, y: touch.clientY };
      timer = setTimeout(() => {
        from = index;
        setPressedIndex(index);
      }, LONG_PRESS_MS);
    }

    function handleMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      if (!isNull(from)) {
        event.preventDefault();
        return;
      }
      const moved = Math.hypot(touch.clientX - start.x, touch.clientY - start.y);
      if (moved > MOVE_TOLERANCE_PX) clearTimeout(timer);
    }

    function handleEnd(event: TouchEvent) {
      const touch = event.changedTouches[0];
      if (!isNull(from) && touch && grid) {
        const to = photoIndexAt({ grid, x: touch.clientX, y: touch.clientY });
        if (!isNull(to)) onMoveRef.current(from, to);
      }
      reset();
    }

    grid.addEventListener("touchstart", handleStart, { passive: true });
    grid.addEventListener("touchmove", handleMove, { passive: false });
    grid.addEventListener("touchend", handleEnd);
    grid.addEventListener("touchcancel", reset);
    return () => {
      clearTimeout(timer);
      grid.removeEventListener("touchstart", handleStart);
      grid.removeEventListener("touchmove", handleMove);
      grid.removeEventListener("touchend", handleEnd);
      grid.removeEventListener("touchcancel", reset);
    };
  }, []);

  return { gridRef, pressedIndex };
}
