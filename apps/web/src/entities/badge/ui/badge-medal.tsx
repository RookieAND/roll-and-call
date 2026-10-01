import type { BadgeLook } from "@roll-and-call/database/rules";
import { cn } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { BadgeSparkles } from "./badge-sparkles";

const face = cva(
  "absolute inset-0 flex items-center justify-center overflow-hidden rounded-full leading-none",
  {
    variants: {
      look: {
        1: "border-2 border-gray-300 bg-gray-50 badge-highlight",
        2: "border-2 border-rank-bronze bg-gray-50 badge-highlight",
        3: "border-2 border-tinted-border bg-primary-50 badge-highlight",
        4: "border-3 badge-framed badge-shaded badge-frame-gold",
        5: "border-3 badge-framed badge-shaded badge-frame-prism badge-glow",
        monthly: "border-3 badge-framed badge-shaded badge-frame-gold badge-glow",
        developer: "border-3 badge-framed badge-shaded badge-frame-developer badge-glow",
        guildMaster: "border-3 badge-framed badge-shaded badge-frame-guild badge-glow",
      },
      locked: {
        true: "border-2 border-dashed border-gray-300 bg-canvas",
        false: "",
      },
    },
    compoundVariants: [
      {
        locked: false,
        look: [1, 2, 3, 4],
        className: "shadow-[inset_0_0_0_2px_var(--color-surface)]",
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
  look: BadgeLook;
  size?: keyof typeof SIZE_CLASS;
  locked?: boolean;
  ribbon?: string | null;
  isNew?: boolean;
  label?: string;
  className?: string;
}

export function BadgeMedal({
  emoji,
  look,
  size = "md",
  locked = false,
  ribbon: ribbonText,
  isNew = false,
  label,
  className,
}: BadgeMedalProps) {
  const shines = !locked && !(look === 1 || look === 2 || look === 3);
  const large = size === "xl" || size === "2xl";
  // 리본은 메달 아래로 삐져나오므로 그만큼 아래를 비워 이름과 겹치지 않게 한다.
  const ribbonSpace = ribbonText && (large ? "mb-175" : "mb-125");
  // 못 받은 뱃지는 단계 색을 입히지 않는다. 두 배경 클래스가 같이 붙으면 CSS 순서에 따라 갈린다.
  const faceLook = locked ? undefined : look;
  const emojiClass = locked ? "opacity-40 grayscale" : undefined;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("relative inline-flex flex-none", SIZE_CLASS[size], className, ribbonSpace)}
    >
      <span className={face({ look: faceLook, locked })}>
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
      {shines && <BadgeSparkles look={look} size={large ? "lg" : "sm"} />}
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
