import type { DiscordGuildMember } from "./get-guild-member";

// 디스코드가 그 서버에서 보여 주는 이름: 서버 닉네임, 전역 표시 이름, 아이디 순.
export function guildMemberDisplayName(member: DiscordGuildMember) {
  return [member.nick, member.user.global_name, member.user.username]
    .map((name) => name?.trim())
    .find(Boolean);
}
