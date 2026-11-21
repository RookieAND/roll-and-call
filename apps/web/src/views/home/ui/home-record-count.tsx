import type { RankingMode } from "@roll-and-call/database/servers/model";
import { Text } from "@roll-and-call/ui";
import type { ComponentProps } from "react";

import { recordUnit } from "./home-record-unit";

interface HomeRecordCountProps {
  count: number;
  mode: RankingMode;
  typography: ComponentProps<typeof Text>["typography"];
  weight?: ComponentProps<typeof Text>["weight"];
  numberClassName?: string;
}

// 큰 숫자 뒤에 작은 단위(횟수제 「회」, 포인트제 「점」)를 붙인다.
export function HomeRecordCount({
  count,
  mode,
  typography,
  weight,
  numberClassName,
}: HomeRecordCountProps) {
  return (
    <>
      <Text
        typography={typography}
        weight={weight}
        numeric
        foreground="inherit"
        className={numberClassName}
      >
        {count}
      </Text>
      <Text typography="body4" weight="bold" foreground="inherit">
        {recordUnit(mode)}
      </Text>
    </>
  );
}
