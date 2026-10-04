import { GRANT_CANDIDATE_STATUS, type GrantCandidateStatus } from "./grant-candidate-status";

export const GRANT_CANDIDATE_TEXT: Record<GrantCandidateStatus, string | null> = {
  [GRANT_CANDIDATE_STATUS.certified]: "이미 이 책을 인증했습니다",
  [GRANT_CANDIDATE_STATUS.blocked]: "기본 룰북 인증이 먼저 필요합니다",
  [GRANT_CANDIDATE_STATUS.pending]: "이 책의 심사가 대기 중입니다",
  [GRANT_CANDIDATE_STATUS.none]: "신청 기록이 없습니다",
  [GRANT_CANDIDATE_STATUS.applied]: null,
};
