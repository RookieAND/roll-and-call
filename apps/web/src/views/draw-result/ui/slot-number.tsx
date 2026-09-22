"use client";

import { useEffect, useState } from "react";

import { seenStorage } from "../model/seen-storage";
import type { SlotSpin } from "../model/slot-spin";

const REEL_LENGTH = 16;
// 빠르게 돌다 끝에서 크게 감속한다. 슬롯머신 릴이 멈추는 느낌.
const REEL_EASING = "cubic-bezier(0.15, 0.85, 0.25, 1)";

interface SlotNumberProps {
  value: number;
  spin: SlotSpin;
}

// 숫자 기둥을 위로 밀어 올려 마지막 칸(실제 값)에서 멈춘다.
// 채움 숫자는 값에서 결정적으로 만든다. 서버와 클라이언트가 같은 HTML을 그려야 해서 Math.random을 쓰지 않는다.
export function SlotNumber({ value, spin }: SlotNumberProps) {
  const [phase, setPhase] = useState<"ready" | "spinning" | "stopped">("ready");
  const { durationMs, onceKey } = spin;

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || (onceKey && seenStorage.has(onceKey))) {
      setPhase("stopped");
      return;
    }
    // 첫 칸이 한 번 그려진 뒤에 옮겨야 transition이 걸린다.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPhase("spinning"));
    });
    return () => cancelAnimationFrame(frame);
  }, [onceKey]);

  const reel = Array.from(
    { length: REEL_LENGTH - 1 },
    (_, index) => ((value * 37 + index * 53) % 100) + 1,
  );
  reel.push(value);
  const offset = phase === "ready" ? 0 : REEL_LENGTH - 1;
  const transition = phase === "spinning" ? `transform ${durationMs}ms ${REEL_EASING}` : "none";

  return (
    <span className="inline-block h-[1em] overflow-hidden align-bottom leading-none">
      <span className="sr-only">{value}</span>
      <span
        aria-hidden
        className="flex flex-col items-end"
        style={{ transform: `translateY(-${offset}em)`, transition }}
        onTransitionEnd={() => {
          // 멈춘 뒤에 적어야 StrictMode가 effect를 두 번 돌려도 첫 방문 연출이 사라지지 않는다.
          if (onceKey) seenStorage.mark(onceKey);
          setPhase("stopped");
        }}
      >
        {reel.map((number, index) => (
          <span key={index} className="h-[1em]">
            {number}
          </span>
        ))}
      </span>
    </span>
  );
}
