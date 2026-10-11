import { compact } from "es-toolkit";

import {
  GRANT_CANDIDATE_STATUS,
  type GrantCandidateStatus,
  type GrantMemberPlan,
} from "./grant-candidate-status";

export const GRANT_CANDIDATE_TEXT: Record<GrantCandidateStatus, string | null> = {
  [GRANT_CANDIDATE_STATUS.certified]: "이미 이 책을 인증했습니다",
  [GRANT_CANDIDATE_STATUS.blocked]: "기본 룰북 인증이 먼저 필요합니다",
  [GRANT_CANDIDATE_STATUS.pending]: "이 책의 심사가 대기 중입니다",
  [GRANT_CANDIDATE_STATUS.none]: "신청 기록이 없습니다",
  [GRANT_CANDIDATE_STATUS.applied]: null,
};

// 유저 행 보조 줄의 상태 문구. 룰북을 하나만 고르면 그 책의 상태, 여러 권이면 권수로 요약한다.
export function grantMemberText(plan: GrantMemberPlan) {
  const [only] = plan.statuses;
  if (plan.statuses.length === 0) return null;
  if (plan.statuses.length === 1 && only) return GRANT_CANDIDATE_TEXT[only.status];
  if (plan.grantable.length === 0 && plan.blocked.length === 0) {
    return "고른 룰북을 모두 인증했습니다";
  }
  return compact([
    plan.grantable.length > 0 ? `${plan.grantable.length}권을 부여합니다` : null,
    plan.approving.length > 0 ? `대기 중인 심사 ${plan.approving.length}건을 승인합니다` : null,
    plan.alreadyCertified.length > 0
      ? `${plan.alreadyCertified.length}권은 이미 인증했습니다`
      : null,
    plan.blocked.length > 0 ? `${plan.blocked.length}권은 기본 룰북 인증이 먼저 필요합니다` : null,
  ]).join(" · ");
}
