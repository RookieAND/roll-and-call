import { Text, cn, type TextProps } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { ROLL_GRADE, type RollGrade } from "../model/roll-grade";
import { ROLL_SPARKLES } from "../model/roll-sparkles";

// 칩이 다 들어온 뒤에 별이 뜨기 시작한다.
const SPARKLE_START_S = 0.5;
const SPARKLE_PATH = "M12 2.6l1.9 5.5 5.5 1.9-5.5 1.9L12 17.4l-1.9-5.5L4.6 10l5.5-1.9z";

const pill = cva(
  "relative inline-flex overflow-hidden items-center justify-center rounded-400 size-9",
  {
    variants: {
      grade: {
        critical: "animate-roll-shine bg-critical-bg text-critical-ink",
        extreme:
          "bg-extreme-bg text-extreme-ink shadow-[inset_0_0_0_1px_var(--color-extreme-border)]",
      },
    },
  },
);

const sparkleColor = {
  critical: "text-critical-sparkle",
  extreme: "text-extreme-ink",
} as const satisfies Record<RollGrade, string>;

interface GradedRollProps {
  value: number;
  grade: RollGrade;
  typography: TextProps["typography"];
}

// 페이지를 열자마자 칩이 흐릿하게 커지며 들어온다. 대성공은 빛줄기가 주기적으로 지나간다.
export function GradedRoll({ value, grade, typography }: GradedRollProps) {
  const critical = grade === ROLL_GRADE.critical;

  return (
    <span className={cn("relative inline-flex flex-none animate-roll-in", critical && "ml-125")}>
      <span className={pill({ grade })}>
        {critical && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/2 animate-roll-sweep bg-linear-to-r from-transparent via-white/60 to-transparent"
          />
        )}
        <Text
          tight
          typography={typography}
          weight="extrabold"
          foreground="inherit"
          className="relative"
        >
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
            animationDelay: `${SPARKLE_START_S + sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          <path d={SPARKLE_PATH} />
        </svg>
      ))}
    </span>
  );
}
