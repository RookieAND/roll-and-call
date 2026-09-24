import { CERT_STATE, type CertState } from "./cert-state";
import { isCertEnforced } from "./is-cert-enforced";

interface PickableRulebook {
  certRequired: boolean;
  state: CertState | null;
}

// 구인을 열 수 있는 룰북: 인증한 것, 인증이 필요 없는 것, 그리고 적용일 전이면 전부.
export function canPickRulebook(
  rulebook: PickableRulebook,
  enforcementDate: Date | null,
  now: Date = new Date(),
) {
  if (!rulebook.certRequired || rulebook.state === CERT_STATE.certified) return true;
  return !isCertEnforced(enforcementDate, now);
}
