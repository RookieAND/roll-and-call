import { cn } from "@trpg/ui";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

interface CandidateStatusTagProps {
  status: ParticipantStatus | null;
}

export function CandidateStatusTag({ status }: CandidateStatusTagProps) {
  if (!status) return null;
  const joined = status === PARTICIPANT_STATUS.confirmed;

  return (
    <span
      className={cn(
        "shrink-0 rounded-100 px-075 py-025 text-body5 font-bold",
        joined ? "bg-success-100 text-success-700" : "bg-warning-50 text-warning-600",
      )}
    >
      {joined ? "이미 참여 중" : "대기열 등록"}
    </span>
  );
}
