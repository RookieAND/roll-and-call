export const SPARK_GRID = 22;
export const SPARK_COLUMNS = 19;
const SPARK_ROWS = 26;
const SPARK_SIZES = [6, 9, 13, 19] as const;

// 렌더마다 자리가 바뀌지 않도록 고정 시드로 흩뿌린다.
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function sizeTier(roll: number) {
  if (roll > 0.96) return 3;
  if (roll > 0.83) return 2;
  if (roll > 0.6) return 1;
  return 0;
}

export const JOIN_SPARKS = Array.from({ length: 100 }, (_, index) => {
  const tier = sizeTier(seeded(index, 3));
  const size = SPARK_SIZES[tier];
  const base = seeded(index, 4) > 0.5 ? "var(--rc-color-bg-primary)" : "var(--rc-color-bg-discord)";
  const center = (cell: number) => cell * SPARK_GRID + SPARK_GRID / 2 - size / 2;
  return {
    left: center(Math.floor(seeded(index, 1) * SPARK_COLUMNS)),
    top: center(Math.floor(seeded(index, 2) * SPARK_ROWS)),
    size,
    glow: tier >= 2 ? 4 : 3,
    color: `color-mix(in srgb, ${base} 55%, var(--rc-color-bg-canvas-base))`,
    duration: `${(4 + seeded(index, 5) * 8).toFixed(1)}s`,
    delay: `${(-seeded(index, 6) * 12).toFixed(1)}s`,
  };
});
