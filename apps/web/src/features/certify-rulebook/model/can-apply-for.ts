import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

// 인증이 필요하고, 아직 인증되지 않았고, 확인 중인 신청도 없는 판본만 신청할 수 있다.
export function canApplyFor(rulebook: MyRulebook) {
  return (
    rulebook.certRequired &&
    rulebook.state !== CERT_STATE.certified &&
    rulebook.state !== CERT_STATE.pending
  );
}
