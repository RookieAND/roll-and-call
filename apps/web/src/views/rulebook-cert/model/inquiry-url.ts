import "server-only";

// 문의 채널 id가 없으면 서버 첫 화면으로 보낸다. 둘 다 없으면 버튼을 숨긴다.
export function inquiryUrl() {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) return null;
  const channelId = process.env.DISCORD_INQUIRY_CHANNEL_ID;
  return `https://discord.com/channels/${guildId}${channelId ? `/${channelId}` : ""}`;
}
