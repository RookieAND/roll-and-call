import { Clock } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import { SummaryLine } from "@/shared/ui";

interface SessionEndedCardProps {
  confirmedAt: Date;
}

export function SessionEndedCard({ confirmedAt }: SessionEndedCardProps) {
  return (
    <SummaryLine
      icon={Clock}
      tone="muted"
      label="세션"
      value={formatDateTime(confirmedAt)}
      badge="끝남"
    />
  );
}
