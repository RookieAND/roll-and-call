import { Table, Text, VStack } from "@roll-and-call/ui";

import type { AdminRound } from "../model/admin-rounds";
import { roundAttendanceLabel } from "../model/round-attendance-label";
import { roundEarlyEndText } from "../model/round-early-end-text";
import { roundStatusOf } from "../model/round-status";
import { roundTimeText } from "../model/round-time-text";
import { RoundStatusCell } from "./round-status-cell";

interface RoundRowProps {
  round: AdminRound;
  now: Date;
  onOpen: (roundNo: number) => void;
}

const dash = (
  <Text typography="body3" foreground="hint">
    -
  </Text>
);

export function RoundRow({ round, now, onOpen }: RoundRowProps) {
  const timeText = roundTimeText(round);
  const earlyEnd = roundEarlyEndText(round);
  const attendance = roundAttendanceLabel({ round, now });
  return (
    <Table.Row interactive className="relative">
      <Table.Cell>
        <Text
          typography="body3"
          weight="bold"
          render={<button type="button" onClick={() => onOpen(round.roundNo)} />}
          className="block cursor-pointer after:absolute after:inset-0"
        >
          {round.roundNo}회차
        </Text>
      </Table.Cell>
      <Table.Cell>
        {timeText ? (
          <VStack>
            <Text typography="body3">{timeText}</Text>
            {earlyEnd && (
              <Text typography="body4" foreground="hint">
                {earlyEnd}
              </Text>
            )}
          </VStack>
        ) : (
          dash
        )}
      </Table.Cell>
      <Table.Cell>
        <RoundStatusCell status={roundStatusOf({ round, now })} />
      </Table.Cell>
      <Table.Cell align="end" numeric>
        {attendance ? <Text typography="body3">{attendance}</Text> : dash}
      </Table.Cell>
    </Table.Row>
  );
}
