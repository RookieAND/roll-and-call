import {
  RULE_GATE,
  SET_STATUS,
  setStatus,
  type EditionSet,
  type RuleGate,
} from "@/entities/rulebook";

// 인증이 필요한 룰 오른쪽의 짧은 이유.
export function ruleReason(set: EditionSet, gate: RuleGate) {
  const { status, missing } = setStatus(set);
  if (status === SET_STATUS.pending) return "심사 중";
  if (status === SET_STATUS.partial) return `${missing.length}권 남음`;
  return gate.type === RULE_GATE.blocked ? "인증 필요" : "인증 전";
}
