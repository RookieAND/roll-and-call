import { Badge } from "@roll-and-call/ui";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

interface CandidateStatusTagProps {
  status: ParticipantStatus | null;
}

export function CandidateStatusTag({ status }: CandidateStatusTagProps) {
  if (!status) return null;
  const joined = status === PARTICIPANT_STATUS.confirmed;
  const color = joined ? "success" : "warning";
  const label = joined ? "이미 참여 중" : "대기열 등록";

  return (
    <Badge colorPalette={color} className="shrink-0 rounded-100 px-075 py-025 text-body5">
      {label}
    </Badge>
  );
}
