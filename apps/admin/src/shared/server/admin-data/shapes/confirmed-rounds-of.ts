import { groupBy } from "es-toolkit";

interface AttendanceRow {
  roundId: string;
  userId: string;
  endsAt: Date | null;
}

// 출석을 확정한 회차마다 참석자를 묶는다. 단발은 쓰지 않는 값이라 undefined다.
export function confirmedRoundsOf({
  roundCount,
  rows,
}: {
  roundCount: number;
  rows: readonly AttendanceRow[];
}): { endsAt: Date | null; attendeeIds: string[] }[] | undefined {
  if (roundCount <= 1) return undefined;
  return Object.values(groupBy(rows, (row) => row.roundId)).map((round) => ({
    endsAt: round[0]!.endsAt,
    attendeeIds: round.map((row) => row.userId),
  }));
}
