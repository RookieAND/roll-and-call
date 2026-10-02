export const HERO_SPARK_GRID = 22;
// 홀수 칸이어야 가운데 맞춘 점 무늬와 칸이 겹친다.
export const HERO_SPARK_COLUMNS = 59;
const HERO_SPARK_ROWS = 30;
const HERO_SPARK_SIZES = [7, 10, 14, 20] as const;

// 렌더마다 자리가 바뀌지 않도록 고정 시드로 흩뿌린다.
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function sizeTier(roll: number) {
  if (roll > 0.94) return 3;
  if (roll > 0.8) return 2;
  if (roll > 0.55) return 1;
  return 0;
}

export const HERO_SPARKS = Array.from({ length: 220 }, (_, index) => {
  const tier = sizeTier(seeded(index, 3));
  const size = HERO_SPARK_SIZES[tier];
  const base = seeded(index, 4) > 0.5 ? "var(--rc-color-bg-primary)" : "var(--rc-color-bg-discord)";
  const mix = tier >= 2 ? 65 : 55;
  const center = (cell: number) => cell * HERO_SPARK_GRID + HERO_SPARK_GRID / 2 - size / 2;
  return {
    left: center(Math.floor(seeded(index, 1) * HERO_SPARK_COLUMNS)),
    top: center(Math.floor(seeded(index, 2) * HERO_SPARK_ROWS)),
    size,
    color: `color-mix(in srgb, ${base} ${mix}%, var(--rc-color-bg-canvas-base))`,
    duration: `${(4 + seeded(index, 5) * 8).toFixed(1)}s`,
    delay: `${(-seeded(index, 6) * 12).toFixed(1)}s`,
  };
});
