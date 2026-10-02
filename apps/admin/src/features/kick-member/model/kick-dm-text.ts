// 추방 직전에 당사자에게 보내는 DM. 모달 미리보기와 실제 DM이 같은 문장을 쓴다.
export function kickDmText({ serverName, reason }: { serverName: string; reason: string }) {
  return `${serverName} 서버에서 추방되었습니다.\n사유: ${reason}`;
}
