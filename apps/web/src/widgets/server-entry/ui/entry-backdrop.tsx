import { JOIN_SPARKS, SPARK_COLUMNS, SPARK_GRID } from "../model/join-sparks";

const GRID_MASK = "radial-gradient(120% 75% at 50% 32%, black 30%, transparent 82%)";
const STAR_PATH =
  "M12 0C12.9 8.2 15.8 11.1 24 12C15.8 12.9 12.9 15.8 12 24C11.1 15.8 8.2 12.9 0 12C8.2 11.1 11.1 8.2 12 0Z";

export function EntryBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ maskImage: GRID_MASK }}>
        <span
          className="absolute inset-0 bg-position-[50%_0]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--rc-color-border-strong) 1px, transparent 1.3px)",
            backgroundSize: `${SPARK_GRID}px ${SPARK_GRID}px`,
          }}
        />
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{ width: SPARK_COLUMNS * SPARK_GRID }}
        >
          {JOIN_SPARKS.map((spark) => (
            <svg
              key={`${spark.left}-${spark.top}-${spark.delay}`}
              viewBox="0 0 24 24"
              width={spark.size}
              height={spark.size}
              className="absolute animate-join-spark overflow-visible opacity-0"
              style={{
                left: spark.left,
                top: spark.top,
                filter: `drop-shadow(0 0 ${spark.glow}px ${spark.color})`,
                animationDuration: spark.duration,
                animationDelay: spark.delay,
              }}
            >
              <path d={STAR_PATH} fill={spark.color} />
            </svg>
          ))}
        </div>
      </div>
      <span
        className="absolute top-62.5 left-1/2 size-75 -translate-1/2 rounded-full opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, var(--rc-color-bg-canvas-base), transparent)",
        }}
      />
    </div>
  );
}
