import { Text } from "@trpg/ui";

import { type AvailabilityInterval, formatInterval } from "../model/availability";

export function AvailabilityDayRow({
  label,
  intervals,
}: {
  label: string;
  intervals: readonly AvailabilityInterval[];
}) {
  return (
    <div className="flex min-h-10 items-center gap-[9px] rounded-[11px] border border-gray-200 px-[11px] py-2">
      <Text
        typography="body4"
        render={<span />}
        className="inline-block w-[30px] flex-none rounded-[7px] bg-primary-50 py-[5px] text-center text-[12px] leading-none font-bold text-primary-ink"
      >
        {label}
      </Text>
      <Text numeric weight="medium" typography="body3" className="min-w-0 flex-1">
        {intervals.map(formatInterval).join(" · ")}
      </Text>
    </div>
  );
}
