import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
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

// 참여 횟수제는 작은 「참여」, 큰 숫자, 작은 「회」. 포인트제는 숫자와 「점」만 쓴다.
export function HomeRecordCount({
  count,
  mode,
  typography,
  weight,
  numberClassName,
}: HomeRecordCountProps) {
  return (
    <>
      {mode === RANKING_MODE.count && (
        <Text typography="body4" weight="bold" foreground="inherit">
          참여
        </Text>
      )}
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
