import { getDiscordId } from "@roll-and-call/database/profiles";

// 본문에 "<@멘션>님이 …" 한 줄을 붙일 입력. 디스코드 계정을 모르면 붙이지 않는다.
export async function memberNoticeLine({ userId, text }: { userId: string; text: string }) {
  const discordId = await getDiscordId(userId);
  if (!discordId) return {};
  return { after: `<@${discordId}>${text}`, userMentions: [discordId] };
}
