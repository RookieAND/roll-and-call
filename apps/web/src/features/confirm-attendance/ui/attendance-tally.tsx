import { HStack, Text } from "@trpg/ui";

import { AbsentCount } from "./absent-count";
import { NoAbsenceCount } from "./no-absence-count";

interface AttendanceTallyProps {
  presentCount: number;
  absentCount: number;
}

export function AttendanceTally({ presentCount, absentCount }: AttendanceTallyProps) {
  return (
    <HStack gap="100" align="center" className="px-025">
      <Text typography="subtitle2" foreground="muted">
        참석 {presentCount}명
      </Text>
      <Text typography="subtitle2" foreground="hint">
        ·
      </Text>
      {absentCount > 0 ? <AbsentCount count={absentCount} /> : <NoAbsenceCount />}
    </HStack>
  );
}
