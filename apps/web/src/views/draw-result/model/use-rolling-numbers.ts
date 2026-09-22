"use client";

import { useEffect, useState } from "react";

const FRAME_MS = 55;

interface RollingOptions {
  durationMs: number;
  // 주어지면 이 브라우저에서 처음 볼 때만 굴린다. 두 번째 방문부터는 값이 처음부터 적혀 있다.
  onceKey?: string;
}

function hasSeen(onceKey: string) {
  try {
    const seen = localStorage.getItem(onceKey) !== null;
    localStorage.setItem(onceKey, "1");
    return seen;
  } catch {
    return false;
  }
}

// 굴림 연출은 숫자에만 둔다. 서버 HTML부터 굴리는 중으로 그려 최종 값이 먼저 번쩍이지 않게 한다.
export function useRollingNumbers(finals: number[], { durationMs, onceKey }: RollingOptions) {
  const [tick, setTick] = useState<number | null>(0);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || (onceKey && hasSeen(onceKey))) setTick(null);
  }, [onceKey]);

  useEffect(() => {
    if (tick === null) return;
    const timer = setTimeout(
      () => setTick(tick * FRAME_MS >= durationMs ? null : tick + 1),
      FRAME_MS,
    );
    return () => clearTimeout(timer);
  }, [tick, durationMs]);

  const rolling = tick !== null;
  const values = rolling
    ? finals.map((_, index) => 1 + ((tick * (7 + index * 3) + index * 17) % 100))
    : finals;
  const replay = () => setTick(0);

  return { values, rolling, replay };
}
