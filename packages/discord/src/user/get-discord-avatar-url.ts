import { discordBotApi } from "../api/discord-bot-api";

// 로그인 때 받은 주소는 디스코드에서 아바타를 바꾸면 404가 되므로 지금 해시로 다시 만든다. 아바타가 없으면 null.
export async function getDiscordAvatarUrl(discordUserId: string) {
  const user = await discordBotApi<{ avatar: string | null }>({ path: `/users/${discordUserId}` });
  if (!user.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${discordUserId}/${user.avatar}.png`;
}
