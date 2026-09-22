"use client";

import { Text, type TextProps } from "@trpg/ui";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

import { ROLL_GRADE, type RollGrade } from "../model/roll-grade";
import { ROLL_SPARKLES } from "../model/roll-sparkles";
import { SLOT_SPIN_MS } from "../model/slot-spin";

const SPARKLE_PATH = "M12 2.6l1.9 5.5 5.5 1.9-5.5 1.9L12 17.4l-1.9-5.5L4.6 10l5.5-1.9z";

const pill = cva("inline-flex h-8 items-center justify-center rounded-400 px-[11px]", {
  variants: {
    grade: {
      critical: "animate-roll-shine bg-critical-bg text-critical-ink",
      extreme: "bg-extreme-bg text-extreme-ink shadow-[inset_0_0_0_1px_var(--color-extreme-border)]",
    },
  },
});

const sparkleColor = {
  critical: "text-critical-sparkle",
  extreme: "text-extreme-ink",
} as const satisfies Record<RollGrade, string>;

interface GradedRollProps {
  value: number;
  grade: RollGrade;
  typography: TextProps["typography"];
}

// 다른 줄의 숫자가 도는 동안 점만 깜빡이다가, 멈추는 순간 칩이 튀어나온다.
export function GradedRoll({ value, grade, typography }: GradedRollProps) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setSettled(true), reducedMotion ? 0 : SLOT_SPIN_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!settled) {
    return (
      <span className="inline-flex h-8 flex-none items-center rounded-400 bg-gray-100 px-[11px]">
        <span className="sr-only">{value}</span>
        <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
      </span>
    );
  }

  return (
    <span
      className={
        grade === ROLL_GRADE.critical
          ? "relative ml-125 inline-flex flex-none animate-roll-pop"
          : "relative inline-flex flex-none"
      }
    >
      <span className={pill({ grade })}>
        <Text numeric tight typography={typography} weight="extrabold" foreground="inherit" className="tracking-tight">
          {value}
        </Text>
      </span>
      {ROLL_SPARKLES[grade].map((sparkle, index) => (
        <svg
          key={index}
          aria-hidden
          width={sparkle.size}
          height={sparkle.size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`absolute animate-roll-twinkle ${sparkleColor[grade]}`}
          style={{
            ...sparkle.position,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          <path d={SPARKLE_PATH} />
        </svg>
      ))}
    </span>
  );
}
