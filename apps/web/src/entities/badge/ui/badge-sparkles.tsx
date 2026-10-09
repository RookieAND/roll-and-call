import type { BadgeLook } from "@roll-and-call/database/badges/model";
import { cn } from "@roll-and-call/ui";

interface SparkleSet {
  colors: string[];
  inset: { sm: number; lg: number };
  // [각도(°), 중심에서 거리(0.5=테두리), 크기 배율, 주기(s)]
  points: [number, number, number, number][];
}

const GOLD: SparkleSet = {
  colors: ["text-rank-gold"],
  inset: { sm: 1, lg: 4 },
  points: [
    [-58, 0.54, 1, 2.3],
    [8, 0.49, 0.55, 3.1],
    [97, 0.56, 0.75, 2.7],
    [163, 0.5, 0.6, 3.4],
    [228, 0.54, 0.9, 2.5],
  ],
};

const SPARKLES: Partial<Record<BadgeLook, SparkleSet>> = {
  5: {
    colors: [
      "text-badge-guild",
      "text-badge-indigo",
      "text-rank-gold",
      "text-badge-green",
      "text-badge-prism",
    ],
    inset: { sm: 3, lg: 6 },
    points: [
      [-47, 0.55, 1, 2.6],
      [36, 0.5, 0.6, 3.3],
      [122, 0.57, 0.8, 2.9],
      [201, 0.51, 0.65, 3.6],
      [262, 0.54, 0.9, 2.4],
    ],
  },
  developer: {
    colors: ["text-badge-green", "text-badge-blue"],
    inset: { sm: 2, lg: 5 },
    points: [
      [-62, 0.55, 1, 2.5],
      [22, 0.5, 0.6, 3.2],
      [104, 0.56, 0.8, 2.8],
      [178, 0.51, 0.55, 3.5],
      [248, 0.55, 0.9, 2.4],
    ],
  },
  guildMaster: {
    colors: ["text-badge-guild", "text-rank-gold"],
    inset: { sm: 2, lg: 5 },
    points: [
      [-52, 0.55, 1, 2.7],
      [31, 0.5, 0.6, 3.1],
      [117, 0.56, 0.8, 2.6],
      [196, 0.51, 0.6, 3.4],
      [259, 0.55, 0.9, 2.5],
    ],
  },
};

// 골드 외에는 테두리 바깥쪽에 작은 별이 셋 더 붙는다.
const EXTRA_POINTS: SparkleSet["points"] = [
  [-14, 0.6, 0.6, 1.8],
  [150, 0.6, 0.6, 1.9],
  [305, 0.6, 0.55, 1.7],
];

const FONT_SIZE = { sm: 12, lg: 20 } as const;

interface BadgeSparklesProps {
  look: BadgeLook;
  size: "sm" | "lg";
}

export function BadgeSparkles({ look, size }: BadgeSparklesProps) {
  const { colors, inset, points: basePoints } = SPARKLES[look] ?? GOLD;
  const points = look === 4 || look === "monthly" ? basePoints : [...basePoints, ...EXTRA_POINTS];
  const glyph = look === "developer" || look === "guildMaster" ? "✧" : "✦";
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ inset: -inset[size] }}>
      {points.map(([degree, radius, scale, baseDuration], index) => {
        const duration = baseDuration * 0.95;
        const angle = (degree * Math.PI) / 180;
        const fontSize = scale * FONT_SIZE[size];
        return (
          <span
            key={degree}
            className={cn(
              "absolute animate-badge-twinkle leading-none",
              colors[index % colors.length],
            )}
            style={
              {
                left: `${50 + 100 * radius * Math.cos(angle)}%`,
                top: `${50 + 100 * radius * Math.sin(angle)}%`,
                margin: -fontSize / 2,
                fontSize,
                "--badge-twinkle-duration": `${duration.toFixed(2)}s`,
                "--badge-twinkle-delay": `-${((duration * index) / points.length).toFixed(2)}s`,
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
