import { Check, CircleAlert, Clock } from "lucide-react";

import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { OptionReason } from "./option-reason";

interface CertOptionReasonProps {
  rulebook: MyRulebook;
}

// 인증 신청에서 고를 수 없는 판본은 이유를 오른쪽에 적는다. 반려됨은 다시 고를 수 있다.
export function CertOptionReason({ rulebook }: CertOptionReasonProps) {
  if (!rulebook.certRequired)
    return <OptionReason label="인증 없이 열 수 있음" foreground="hint" />;
  if (rulebook.state === CERT_STATE.certified) {
    return <OptionReason label="인증됨" icon={Check} foreground="success" />;
  }
  if (rulebook.state === CERT_STATE.pending) {
    return <OptionReason label="확인 중" icon={Clock} foreground="hint" />;
  }
  if (rulebook.state === CERT_STATE.rejected) {
    return <OptionReason label="반려됨 · 다시 신청" icon={CircleAlert} foreground="warning" />;
  }
  return null;
}
