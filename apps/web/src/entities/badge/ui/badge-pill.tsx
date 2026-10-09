import type { BadgeLook } from "@roll-and-call/database/badges/model";
import { cn } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

const pill = cva(
  "relative inline-flex max-w-full min-w-0 shrink-0 items-center gap-050 rounded-full border font-extrabold tracking-tight whitespace-nowrap",
  {
    variants: {
      look: {
        1: "border-gray-200 bg-gray-50 text-gray-900",
        2: "border-rank-bronze bg-gray-50 text-rank-bronze",
        3: "border-tinted-border bg-primary-50 text-tinted-ink",
        4: "badge-framed badge-frame-gold text-rank-gold",
        5: "badge-framed badge-frame-prism text-badge-prism",
        monthly: "badge-framed badge-frame-gold text-rank-gold",
        developer: "badge-framed badge-frame-developer text-badge-developer",
        guildMaster: "badge-framed badge-frame-guild text-badge-guild",
      },
      size: {
        md: "h-8 pr-125 pl-100 text-body4",
        sm: "h-[26px] pr-100 pl-075 text-body4",
      },
    },
  },
);

// 알약 가장자리 반짝이: [왼쪽 %, 위 %, 크기 px, 주기 s]
const PILL_SPARKS = [
  [-3, 4, 9, 1.7],
  [24, 106, 7, 2.1],
  [62, -5, 9, 1.6],
  [99, 40, 9, 2.0],
] as const;

const PILL_SPARK_COLORS: Partial<Record<BadgeLook, string[]>> = {
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

interface BadgePillProps {
  emoji: string;
  name: string;
  look: BadgeLook;
  tag?: string | null;
  size?: "md" | "sm";
  className?: string;
}

export function BadgePill({ emoji, name, look, tag, size = "md", className }: BadgePillProps) {
  const shines = look !== 1 && look !== 2 && look !== 3;
  const sparkColors = PILL_SPARK_COLORS[look];
  const glyph = look === "developer" || look === "guildMaster" ? "✧" : "✦";
  return (
    <span title={name} className={cn(pill({ look, size }), className)}>
      <span
        aria-hidden
        className="flex size-[1em] flex-none items-center justify-center text-subtitle1 leading-none"
      >
        {emoji}
      </span>
      <span className="min-w-0 truncate">{name}</span>
      {tag && (
        <span className="flex h-4.5 flex-none items-center rounded-full bg-primary-600 px-075 text-body4 leading-none font-extrabold text-on-primary">
          {tag}
        </span>
      )}
      {shines && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full animate-badge-shine"
        />
      )}
      {sparkColors &&
        PILL_SPARKS.map(([left, top, fontSize, baseDuration], index) => {
          const duration = baseDuration * 1.3;
          return (
            <span
              key={left}
              aria-hidden
              className={cn(
                "pointer-events-none absolute animate-badge-twinkle leading-none",
                sparkColors[index % sparkColors.length],
              )}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  margin: -fontSize / 2,
                  fontSize,
                  "--badge-twinkle-duration": `${duration.toFixed(2)}s`,
                  "--badge-twinkle-delay": `-${((duration * index) / PILL_SPARKS.length).toFixed(2)}s`,
                } as React.CSSProperties
              }
            >
              {glyph}
            </span>
          );
        })}
    </span>
  );
}
