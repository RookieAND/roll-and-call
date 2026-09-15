// 봇 토큰으로 부르는 Discord REST. 상주 봇 프로세스(gateway)는 없다 — 전부 서버 액션에서 한 번씩 호출한다.
// ponytail: 429(rate limit)는 재시도 없이 실패로 올린다. 알림은 가끔 가는 거라 충분.

export type DiscordEmbedField = { name: string; value: string; inline?: boolean };

export type DiscordEmbed = {
  title?: string;
  url?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  image?: { url: string };
  footer?: { text: string };
  timestamp?: string;
};

type DiscordMessage = { id: string; channel_id: string };

async function botApi<T>(path: string, { method = "GET", body }: { method?: string; body?: unknown } = {}) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN not set");
  const res = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      authorization: `Bot ${token}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    // 제목·개요 등 유저 입력에 섞인 @everyone/@here가 글자로도 보이지 않게 지운다 (핑은 allowed_mentions가 이미 막음).
    body: body === undefined ? undefined : JSON.stringify(body).replace(/@(everyone|here)\b/g, ""),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Discord ${method} ${path} → ${res.status} ${await res.text()}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

// --- 메시지 ---

type MessageInput = {
  content?: string;
  embeds?: DiscordEmbed[];
  // 실제로 핑을 보낼 Discord user id (allowed_mentions allowlist). 멘션은 content에 있어야 울린다.
  userMentions?: string[];
};

const messageBody = ({ content, embeds, userMentions = [] }: MessageInput) => ({
  content,
  embeds,
  allowed_mentions: { parse: [], users: userMentions },
});

// 채널 또는 스레드(스레드 id도 채널 id다)에 보낸다.
// 알림 실패가 유저 동작(개설/신청)을 막으면 안 된다 — 실패는 삼킨다.
export async function sendDiscordMessage(
  channelId: string | null | undefined,
  input: MessageInput,
): Promise<DiscordMessage | undefined> {
  if (!channelId) {
    console.warn("Discord channel id not set; skipping message");
    return;
  }
  try {
    return await botApi<DiscordMessage>(`/channels/${channelId}/messages`, {
      method: "POST",
      body: messageBody(input),
    });
  } catch (err) {
    console.warn("Discord message failed:", err);
  }
}

// 봇이 보낸 메시지만 고칠 수 있다. 빠진 필드(content 등)는 그대로 남는다.
export async function editDiscordMessage(
  channelId: string | null | undefined,
  messageId: string,
  input: MessageInput,
) {
  if (!channelId) return;
  try {
    await botApi(`/channels/${channelId}/messages/${messageId}`, {
      method: "PATCH",
      body: messageBody(input),
    });
  } catch (err) {
    console.warn("Discord message edit failed:", err);
  }
}

// 텍스트 채널 메시지에 스레드를 연다. 메시지에서 연 스레드의 id는 그 메시지 id와 같다.
// 알림 부가기능이라 실패는 삼킨다.
export async function startDiscordThread(
  message: DiscordMessage,
  name: string,
): Promise<string | undefined> {
  try {
    const thread = await botApi<{ id: string }>(
      `/channels/${message.channel_id}/messages/${message.id}/threads`,
      { method: "POST", body: { name: name.slice(0, 100), auto_archive_duration: 10080 } },
    );
    return thread.id;
  } catch (err) {
    console.warn("Discord thread creation failed:", err);
  }
}

// 스레드 이름을 맞춘다. Discord는 채널·스레드 이름 변경을 10분에 2번으로 제한하므로 같으면 부르지 않는다.
// ponytail: 보관(archived)된 스레드는 이름을 못 바꾼다 — 실패는 삼키고 넘어간다.
export async function renameDiscordThread(threadId: string, name: string) {
  const next = name.slice(0, 100);
  try {
    const thread = await botApi<{ name: string }>(`/channels/${threadId}`);
    if (thread.name === next) return;
    await botApi(`/channels/${threadId}`, { method: "PATCH", body: { name: next } });
  } catch (err) {
    console.warn("Discord thread rename failed:", err);
  }
}
