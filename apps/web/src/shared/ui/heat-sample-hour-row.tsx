import { Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

const BEST_STEP = 5;

const BEST_RING = "0 0 0 2px var(--rc-color-bg-canvas-base), 0 0 0 4px var(--rc-color-heat-5)";

const heatCell = cva("h-[25px] rounded-200", {
  variants: {
    empty: { true: "bg-gray-100", false: "" },
  },
});

interface HeatSampleHourRowProps {
  hour: string;
  steps: number[];
}

export function HeatSampleHourRow({ hour, steps }: HeatSampleHourRowProps) {
  return (
    <>
      <Text
        typography="body4"
        weight="bold"
        foreground="hint"
        render={<span />}
        className="flex h-[25px] items-center tabular-nums"
      >
        {hour}
      </Text>
      {steps.map((step, index) => {
        const style =
          step === 0
            ? undefined
            : {
                backgroundColor: `var(--color-heat-${step})`,
                boxShadow: step === BEST_STEP ? BEST_RING : undefined,
              };
        return <span key={index} className={heatCell({ empty: step === 0 })} style={style} />;
      })}
    </>
  );
}
