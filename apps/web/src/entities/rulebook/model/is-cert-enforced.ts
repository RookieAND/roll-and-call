// 적용일이 비어 있거나 지났으면 인증이 필요한 룰북은 인증 없이 고를 수 없다. 적용일 전까지는 유예 기간이다.
export function isCertEnforced(enforcementDate: Date | null, now: Date = new Date()) {
  return !enforcementDate || enforcementDate.getTime() <= now.getTime();
}
