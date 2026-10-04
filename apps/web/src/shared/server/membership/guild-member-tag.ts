// 디스코드 서버 멤버 확인 캐시를 사람·서버 하나만 지울 때 쓴다.
export function guildMemberTag({
  guildId,
  discordUserId,
}: {
  guildId: string;
  discordUserId: string;
}) {
  return `discord-guild-member:${guildId}:${discordUserId}`;
}
