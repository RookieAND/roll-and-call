// 운영진이 직접 전할 문구다. 봇은 DM을 보내지 않는다(D166). 사유를 고르기 전에는 첫 줄만 보인다.
export function kickNoticeText({ serverName, reason }: { serverName: string; reason: string }) {
  const first = `${serverName} 서버에서 추방되었습니다.`;
  const trimmed = reason.trim().replace(/\.$/, "");
  return trimmed ? `${first}\n사유: ${trimmed}` : first;
}
