// 운영진이 직접 전할 문구다. 봇은 DM을 보내지 않는다(D166).
export function kickNoticeText({ serverName, reason }: { serverName: string; reason: string }) {
  return `${serverName} 서버에서 추방되었습니다.\n사유: ${reason.replace(/\.$/, "")}`;
}
