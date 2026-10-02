import { discordBotApi } from "../api/discord-bot-api";

// 봇 토큰의 주인(봇 계정). 서버에서 봇 멤버를 찾을 때 id를 쓴다.
export function getBotUser() {
  return discordBotApi<{ id: string }>({ path: "/users/@me" });
}
