import { HStack, Text } from "@trpg/ui";

import { AbsentCount } from "./absent-count";
import { NoAbsenceCount } from "./no-absence-count";

export function AttendanceTally({
  presentCount,
  absentCount,
}: {
  presentCount: number;
  absentCount: number;
}) {
  return (
    <HStack gap="100" align="center" className="px-025">
      <Text typography="subtitle1" foreground="muted">
        참석 {presentCount}명
      </Text>
      <Text typography="body3" foreground="hint">
        ·
      </Text>
      {absentCount > 0 ? <AbsentCount count={absentCount} /> : <NoAbsenceCount />}
    </HStack>
  );
}
