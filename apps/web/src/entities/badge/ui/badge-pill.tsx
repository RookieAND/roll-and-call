import type { BadgeGrade } from "@roll-and-call/database/rules";
import { cn } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

// 프로필 이름 아래에 붙는 이모지 + 짧은 이름 한 덩어리. 색은 메달과 같은 단계를 따른다.
const pill = cva(
  "relative inline-flex max-w-full min-w-0 shrink-0 items-center gap-050 overflow-hidden rounded-full border font-extrabold tracking-tight whitespace-nowrap",
  {
    variants: {
      grade: {
        1: "border-gray-200 bg-gray-50 text-gray-900",
        2: "border-rank-bronze bg-warning-50 text-rank-bronze",
        3: "border-tinted-border bg-primary-50 text-tinted-ink",
        4: "border-rank-gold bg-warning-50 text-rank-gold",
        5: "border-rank-gold bg-warning-50 text-rank-gold",
      },
      size: {
        md: "h-8 pr-125 pl-100 text-body4",
        sm: "h-[26px] pr-100 pl-075 text-body4",
      },
    },
  },
);

interface BadgePillProps {
  emoji: string;
  name: string;
  grade: BadgeGrade;
  tag?: string | null;
  size?: "md" | "sm";
  className?: string;
}

export function BadgePill({ emoji, name, grade, tag, size = "md", className }: BadgePillProps) {
  return (
    <span title={name} className={cn(pill({ grade, size }), className)}>
      <span
        aria-hidden
        className="flex size-[1em] flex-none items-center justify-center text-subtitle1 leading-none"
      >
        {emoji}
      </span>
      <span className="min-w-0 truncate">{name}</span>
      {tag && (
        <span className="flex h-[18px] flex-none items-center rounded-full bg-primary-600 px-075 text-body4 leading-none font-extrabold text-on-primary">
          {tag}
        </span>
      )}
      {grade >= 4 && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full animate-badge-shine"
        />
      )}
    </span>
  );
}
