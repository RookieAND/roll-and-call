import { VStack } from "@roll-and-call/ui";

import { AttendanceBanner } from "./attendance-banner";
import { SessionEndedCard } from "./session-ended-card";

interface AttendanceCardProps {
  gameId: string;
  confirmedAt: Date;
  confirmedCount: number;
}

export function AttendanceCard({ gameId, confirmedAt, confirmedCount }: AttendanceCardProps) {
  return (
    <VStack gap="100">
      <SessionEndedCard confirmedAt={confirmedAt} />
      <AttendanceBanner gameId={gameId} confirmedCount={confirmedCount} />
    </VStack>
  );
}
