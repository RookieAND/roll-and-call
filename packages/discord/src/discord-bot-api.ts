// 상주 봇(gateway) 없이 서버 액션에서 봇 토큰으로 REST만 부른다.
// ponytail: 429(rate limit)는 재시도 없이 실패로 올린다. 알림은 가끔 가는 거라 충분.
export async function discordBotApi<T>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {},
) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN not set");
  const response = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      authorization: `Bot ${token}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    // 유저 입력의 @everyone/@here를 글자로도 지운다(핑은 allowed_mentions가 이미 막음).
    body: body === undefined ? undefined : JSON.stringify(body).replace(/@(everyone|here)\b/g, ""),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Discord ${method} ${path} → ${response.status} ${await response.text()}`);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}
