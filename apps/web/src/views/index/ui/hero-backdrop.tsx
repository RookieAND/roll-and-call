import { HERO_SPARK_COLUMNS, HERO_SPARK_GRID, HERO_SPARKS } from "../model/hero-sparks";

const FADE_MASK = "linear-gradient(180deg, black 0%, transparent 85%)";
const STAR_PATH =
  "M12 0C12.9 8.2 15.8 11.1 24 12C15.8 12.9 12.9 15.8 12 24C11.1 15.8 8.2 12.9 0 12C8.2 11.1 11.1 8.2 12 0Z";

// 점 무늬 위에서 별이 하나씩 반짝이고, 아래로 갈수록 흐려진다.
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: FADE_MASK }}
    >
      <span
        className="absolute inset-0 bg-position-[50%_0]"
        style={{
          backgroundImage: "radial-gradient(var(--rc-color-border-normal) 1px, transparent 1.2px)",
          backgroundSize: `${HERO_SPARK_GRID}px ${HERO_SPARK_GRID}px`,
        }}
      />
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2"
        style={{ width: HERO_SPARK_COLUMNS * HERO_SPARK_GRID }}
      >
        {HERO_SPARKS.map((spark) => (
          <svg
            key={`${spark.left}-${spark.top}-${spark.delay}`}
            viewBox="0 0 24 24"
            width={spark.size}
            height={spark.size}
            className="absolute animate-join-spark opacity-0"
            style={{
              left: spark.left,
              top: spark.top,
              animationDuration: spark.duration,
              animationDelay: spark.delay,
            }}
          >
            <path d={STAR_PATH} fill={spark.color} />
          </svg>
        ))}
      </div>
    </div>
  );
}
