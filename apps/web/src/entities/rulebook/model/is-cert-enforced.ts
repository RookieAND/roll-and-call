// 적용일이 지나면 인증이 필요한 룰북은 인증 없이 고를 수 없다. 적용일이 비어 있으면 안내 기간이 이어진다.
export function isCertEnforced(enforcementDate: Date | null, now: Date = new Date()) {
  return enforcementDate !== null && enforcementDate.getTime() <= now.getTime();
}
