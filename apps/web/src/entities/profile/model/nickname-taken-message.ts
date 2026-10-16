// 같은 서버에 같은 닉네임이 있을 때 닉네임 칸 아래 두 줄로 보인다.
export function nicknameTakenMessage(serverName: string) {
  return `${serverName}에 같은 닉네임이 있습니다.\n다른 닉네임을 정해 주세요.`;
}
