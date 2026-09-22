"use client";

import { useEffect, useState } from "react";

import { SLOT_SPIN_MS } from "../model/slot-spin";

const REEL_LENGTH = 16;
// 빠르게 돌다 끝에서 크게 감속한다. 슬롯머신 릴이 멈추는 느낌.
const REEL_EASING = "cubic-bezier(0.15, 0.85, 0.25, 1)";

interface SlotNumberProps {
  value: number;
}

// 들어올 때마다 숫자 기둥을 위로 밀어 올려 마지막 칸(실제 값)에서 멈춘다.
// 채움 숫자는 값에서 결정적으로 만든다. 서버와 클라이언트가 같은 HTML을 그려야 해서 Math.random을 쓰지 않는다.
export function SlotNumber({ value }: SlotNumberProps) {
  const [phase, setPhase] = useState<"ready" | "spinning" | "stopped">("ready");

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setPhase("stopped");
      return;
    }
    // 첫 칸이 한 번 그려진 뒤에 옮겨야 transition이 걸린다.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPhase("spinning"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const reel = Array.from(
    { length: REEL_LENGTH - 1 },
    (_, index) => ((value * 37 + index * 53) % 100) + 1,
  );
  reel.push(value);
  const offset = phase === "ready" ? 0 : REEL_LENGTH - 1;
  const transition = phase === "spinning" ? `transform ${SLOT_SPIN_MS}ms ${REEL_EASING}` : "none";

  return (
    <span className="inline-block h-[1em] overflow-hidden align-bottom leading-none">
      <span className="sr-only">{value}</span>
      <span
        aria-hidden
        className="flex flex-col items-end"
        style={{ transform: `translateY(-${offset}em)`, transition }}
        onTransitionEnd={() => setPhase("stopped")}
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
