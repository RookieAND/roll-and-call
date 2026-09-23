import { HStack, Text, VStack } from "@roll-and-call/ui";

import { HeatSampleHourRow } from "./heat-sample-hour-row";

const DAYS = ["월", "화", "수", "목", "금"];
const HOURS = ["19시", "20시", "21시", "22시"];
const STEPS = [0, 1, 0, 2, 1, 1, 2, 1, 4, 2, 2, 4, 2, 5, 4, 0, 1, 0, 2, 1];
const PICKED_DAY_INDEX = DAYS.length - 1;

// 온보딩과 도움말이 같은 격자 그림을 쓴다. 실제 조율 화면이 아니라 설명용 축소판이다.
export function HeatSample() {
  return (
    <VStack gap="125">
      <div className="grid grid-cols-[auto_repeat(5,minmax(0,38px))] gap-x-100 gap-y-050">
        <span />
        {DAYS.map((day, index) => (
          <Text
            key={day}
            typography="body4"
            weight={index === PICKED_DAY_INDEX ? "extrabold" : "bold"}
            foreground={index === PICKED_DAY_INDEX ? "primary" : "hint"}
            render={<span />}
            className="text-center"
          >
            {day}
          </Text>
        ))}
        {HOURS.map((hour, row) => (
          <HeatSampleHourRow key={hour} hour={hour} steps={STEPS.slice(row * 5, row * 5 + 5)} />
        ))}
      </div>
      <HStack align="center" gap="100" className="border-t border-gray-200 pt-125">
        <Text typography="body4" weight="bold" foreground="hint" render={<span />}>
          적음
        </Text>
        <span
          className="h-[7px] flex-1 rounded-100"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--rc-color-bg-secondary), var(--color-heat-1), var(--color-heat-2), var(--color-heat-3), var(--color-heat-4), var(--color-heat-5))",
          }}
        />
        <Text typography="body4" weight="bold" foreground="hint" render={<span />}>
          모두 가능
        </Text>
      </HStack>
    </VStack>
  );
}
