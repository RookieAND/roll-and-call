import { isUndefined } from "es-toolkit";

import { fetchDiscord } from "./fetch-discord";

// 상주 봇(gateway) 없이 서버 액션에서 봇 토큰으로 REST만 부른다.
// ponytail: 429(rate limit)는 재시도 없이 실패로 올린다. 알림은 가끔 가는 거라 충분. 멤버십 크론만 retryAfter를 보고 한 번 더 부른다.
export async function discordBotApi<T>({
  path,
  method = "GET",
  body,
}: {
  path: string;
  method?: string;
  body?: unknown;
}) {
  const response = await fetchDiscord({
    path,
    method,
    headers: isUndefined(body) ? {} : { "content-type": "application/json" },
    // 유저 입력의 @everyone/@here를 글자로도 지운다(핑은 allowed_mentions가 이미 막음).
    body: isUndefined(body) ? undefined : JSON.stringify(body).replace(/@(everyone|here)\b/g, ""),
    timeoutMs: 8000,
  });
  return (response.status === 204 ? undefined : await response.json()) as T;
}
