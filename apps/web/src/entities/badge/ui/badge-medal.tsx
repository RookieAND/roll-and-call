import type { BadgeGrade } from "@roll-and-call/database/rules";
import { cn } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { BadgeSparkles } from "./badge-sparkles";

// 금색 이모지(🏆·👑·🎖️)가 묻히지 않게 4·5단계도 옅은 바탕을 쓴다. 단계가 오를수록 테두리 색이 바뀌고, 4단계부터 빛이 지나가며 5는 후광이 더해진다. 못 받은 뱃지는 점선에 흐린 이모지.
const face = cva(
  "absolute inset-0 flex items-center justify-center overflow-hidden rounded-full leading-none",
  {
    variants: {
      grade: {
        1: "border-2 border-gray-300 bg-gray-50",
        2: "border-2 border-rank-bronze bg-warning-50",
        3: "border-2 border-tinted-border bg-primary-50",
        4: "border-2 border-rank-gold bg-warning-50",
        5: "border-3 border-rank-gold bg-warning-50",
      },
      locked: {
        true: "border-2 border-dashed border-gray-300 bg-canvas",
        false: "badge-highlight",
      },
      glow: { true: "", false: "" },
    },
    compoundVariants: [
      { locked: false, glow: false, className: "shadow-[inset_0_0_0_2px_var(--color-surface)]" },
      {
        locked: false,
        glow: true,
        className:
          "shadow-[inset_0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-warning-50),0_8px_20px_-6px_var(--color-rank-gold)]",
      },
    ],
  },
);

const ribbon = cva(
  "absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-primary-600 font-extrabold whitespace-nowrap text-on-primary ring-surface",
  {
    variants: {
      large: {
        false: "-bottom-[7px] h-5 px-100 text-body4 leading-none ring-2",
        true: "-bottom-[11px] h-6 px-125 text-body3 leading-none ring-3",
      },
    },
  },
);

const SIZE_CLASS = {
  xs: "badge-size-xs",
  sm: "badge-size-sm",
  md: "badge-size-md",
  lg: "badge-size-lg",
  xl: "badge-size-xl",
  "2xl": "badge-size-2xl",
} as const;

export interface BadgeMedalProps {
  emoji: string;
  grade: BadgeGrade;
  size?: keyof typeof SIZE_CLASS;
  locked?: boolean;
  // 이달의 뱃지에 붙는 달("9월").
  ribbon?: string | null;
  isNew?: boolean;
  label?: string;
  className?: string;
}

export function BadgeMedal({
  emoji,
  grade,
  size = "md",
  locked = false,
  ribbon: ribbonText,
  isNew = false,
  label,
  className,
}: BadgeMedalProps) {
  const shines = !locked && grade >= 4;
  const large = size === "xl" || size === "2xl";
  // 리본은 메달 아래로 삐져나오므로 그만큼 아래를 비워 이름과 겹치지 않게 한다.
  const ribbonSpace = ribbonText ? (large ? "mb-175" : "mb-125") : undefined;
  // 못 받은 뱃지는 단계 색을 입히지 않는다. 두 배경 클래스가 같이 붙으면 CSS 순서에 따라 갈린다.
  const faceGrade = locked ? undefined : grade;
  const emojiClass = locked ? "opacity-40 grayscale" : undefined;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("relative inline-flex flex-none", SIZE_CLASS[size], className, ribbonSpace)}
    >
      <span className={face({ grade: faceGrade, locked, glow: grade === 5 })}>
        <span aria-hidden className={cn("flex size-[1em] items-center justify-center", emojiClass)}>
          {emoji}
        </span>
        {shines && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full animate-badge-shine"
          />
        )}
      </span>
      {shines && <BadgeSparkles size={large ? "lg" : "sm"} />}
      {ribbonText && (
        <span aria-hidden className={ribbon({ large })}>
          {ribbonText}
        </span>
      )}
      {isNew && (
        <span
          role="img"
          aria-label="새 뱃지"
          className="absolute top-0 right-0 size-[11px] rounded-full border-2 border-surface bg-danger-600"
        />
      )}
    </span>
  );
}
