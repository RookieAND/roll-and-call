export function raisedToastMessage({
  maxPlayers,
  username,
}: {
  maxPlayers: number;
  username: string;
}) {
  return `정원을 ${maxPlayers + 1}명으로 늘리고 ${username}님을 참여자로 넣었습니다`;
}
