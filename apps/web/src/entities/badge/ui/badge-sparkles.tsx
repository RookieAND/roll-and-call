import type { BadgeLook } from "@roll-and-call/database/rules";
import { cva } from "class-variance-authority";

const sparkles = cva("pointer-events-none absolute", {
  variants: { size: { sm: "-inset-[7px]", lg: "-inset-[14px]" } },
});

const star = cva("absolute animate-badge-twinkle leading-none", {
  variants: {
    size: { sm: "", lg: "" },
    small: { true: "", false: "" },
  },
  compoundVariants: [
    { size: "sm", small: false, className: "text-body4" },
    { size: "sm", small: true, className: "text-body5" },
    { size: "lg", small: false, className: "text-heading2" },
    { size: "lg", small: true, className: "text-subtitle2" },
  ],
});

const STARS = [
  "top-0 left-[6%] [animation-delay:0s]",
  "top-[8%] right-0 [animation-delay:0.65s]",
  "right-[12%] bottom-[2%] [animation-delay:1.3s]",
  "bottom-[16%] left-0 [animation-delay:1.95s]",
] as const;

// 별은 순서대로 이 색을 돌려 입는다.
const PALETTE: Partial<Record<BadgeLook, string[]>> = {
  5: [
    "text-badge-guild",
    "text-badge-indigo",
    "text-rank-gold",
    "text-badge-green",
    "text-badge-prism",
  ],
  developer: ["text-badge-green", "text-badge-blue"],
  guildMaster: ["text-badge-guild", "text-rank-gold"],
};
const GOLD = ["text-rank-gold"];

interface BadgeSparklesProps {
  look: BadgeLook;
  size: "sm" | "lg";
}

export function BadgeSparkles({ look, size }: BadgeSparklesProps) {
  const colors = PALETTE[look] ?? GOLD;
  return (
    <span aria-hidden className={sparkles({ size })}>
      {STARS.map((position, index) => (
        <span
          key={position}
          className={`${star({ size, small: index % 2 === 1 })} ${position} ${colors[index % colors.length]}`}
        >
          ✦
        </span>
      ))}
    </span>
  );
}
