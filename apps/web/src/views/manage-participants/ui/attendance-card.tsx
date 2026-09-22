import { VStack } from "@roll-and-call/ui";

import { AttendanceBanner } from "./attendance-banner";
import { SessionEndedCard } from "./session-ended-card";

interface AttendanceCardProps {
  gameId: string;
  confirmedAt: Date;
  confirmedCount: number;
}

// 세션이 끝나면 명단 관리 대신 이 한 가지만 남는다.
export function AttendanceCard({ gameId, confirmedAt, confirmedCount }: AttendanceCardProps) {
  return (
    <VStack gap="100">
      <SessionEndedCard confirmedAt={confirmedAt} />
      <AttendanceBanner gameId={gameId} confirmedCount={confirmedCount} />
    </VStack>
  );
}
