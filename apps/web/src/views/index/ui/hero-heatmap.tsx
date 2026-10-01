import { Text } from "@roll-and-call/ui";
import { Fragment } from "react";

import {
  HERO_HEAT_DAYS,
  HERO_HEAT_HOURS,
  HERO_HEAT_PICKED_INDEX,
  HERO_HEAT_STEPS,
} from "../model/demo-heat";
import { heatBackground } from "../model/heat-background";

export function HeroHeatmap() {
  return (
    <div className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] grid-rows-[17px_repeat(4,28px)] gap-x-100 gap-y-050">
      <span />
      {HERO_HEAT_DAYS.map((day) => (
        <Text key={day} typography="body4" weight="bold" foreground="hint" className="text-center">
          {day}
        </Text>
      ))}
      {HERO_HEAT_STEPS.map((step, index) => {
        const hourLabel = index % HERO_HEAT_DAYS.length === 0 && (
          <Text
            typography="body4"
            weight="bold"
            foreground="hint"
            numeric
            className="flex items-center"
          >
            {HERO_HEAT_HOURS[index / HERO_HEAT_DAYS.length]}
          </Text>
        );
        const picked = index === HERO_HEAT_PICKED_INDEX;
        return (
          <Fragment key={index}>
            {hourLabel}
            <span
              className="rounded-200"
              style={{
                background: heatBackground(step),
                boxShadow: picked ? "0 0 0 2px var(--rc-color-border-primary-strong)" : undefined,
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
