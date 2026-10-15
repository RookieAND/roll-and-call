import { retry } from "es-toolkit";

import { DiscordApiError } from "./discord-api-error";
import { discordErrorCode, discordRetryAfter } from "./discord-error-code";

// 다시 보내도 결과가 같은 요청. POST(메시지 보내기 등)는 시간 초과 때 이미 올라갔을 수 있어 다시 보내지 않는다.
const IDEMPOTENT_METHODS: ReadonlySet<string> = new Set(["GET", "PUT", "PATCH", "DELETE"]);

// 봇 토큰으로 디스코드 REST를 부르고, 실패하면 DiscordApiError로 올린다.
// 다시 보내도 되는 요청은 5xx·시간 초과일 때 한 번 더 부른다. 429는 부르는 쪽이 retryAfter를 보고 정한다.
export async function fetchDiscord({
  path,
  method,
  headers,
  body,
  timeoutMs,
}: {
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: RequestInit["body"];
  timeoutMs: number;
}) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN not set");
  const request = async () => {
    const response = await fetch(`https://discord.com/api/v10${path}`, {
      method,
      headers: { authorization: `Bot ${token}`, ...headers },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new DiscordApiError(
        `Discord ${method} ${path} → ${response.status} ${text}`,
        response.status,
        discordErrorCode(text),
        discordRetryAfter(text),
      );
    }
    return response;
  };
  if (!IDEMPOTENT_METHODS.has(method)) return request();
  return retry(request, {
    retries: 1,
    shouldRetry: (error) =>
      (error instanceof DiscordApiError && error.status >= 500) ||
      (error instanceof Error && error.name === "TimeoutError"),
  });
}
