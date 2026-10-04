import { Badge } from "@roll-and-call/ui";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

interface CandidateStatusTagProps {
  status: ParticipantStatus | null;
}

export function CandidateStatusTag({ status }: CandidateStatusTagProps) {
  // 불참으로 내보낸 사람은 다시 넣을 수 있는 미참여자처럼 보인다.
  if (!status || status === PARTICIPANT_STATUS.removed) return null;
  const joined = status === PARTICIPANT_STATUS.confirmed;
  const color = joined ? "success" : "warning";
  const label = joined ? "이미 참여 중" : "대기열 등록";

  return <Badge colorPalette={color}>{label}</Badge>;
}
