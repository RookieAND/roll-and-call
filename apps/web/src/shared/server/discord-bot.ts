// 봇 토큰으로 부르는 Discord REST. 상주 봇 프로세스(gateway)는 없다 — 전부 서버 액션에서 한 번씩 호출한다.
// ponytail: 429(rate limit)는 재시도 없이 실패로 올린다. 세션 채널은 GM이 가끔 여는 거라 충분.

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
type DiscordChannel = { id: string; name: string; type: number; parent_id: string | null };
type Overwrite = { id: string; type: 0 | 1; allow: string; deny: string };

async function botApi<T>(path: string, { method = "GET", body }: { method?: string; body?: unknown } = {}) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN not set");
  const res = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      authorization: `Bot ${token}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
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

// --- 세션 채널 ---

const VIEW = 1n << 10n;
const SEND = 1n << 11n;
const HISTORY = 1n << 16n;
const CONNECT = 1n << 20n;
const SPEAK = 1n << 21n;
const MANAGE_CHANNELS = 1n << 4n;

const MEMBER = VIEW | SEND | HISTORY | CONNECT | SPEAK;
const BOT = VIEW | MANAGE_CHANNELS; // @everyone 가림 뒤에서도 봇이 채널을 고칠 수 있게

const TEXT = 0;
const VOICE = 2;
const CATEGORY = 4;

// 생성 중 선점 표시. 두 번 눌러도 카테고리가 하나만 생기게 DB에 먼저 박는다.
export const DISCORD_ROOMS_OPENING = "opening";

const ACTIVE_NAME = /^세션 (\d+) · /;
const ARCHIVED_PREFIX = "[종료] ";

const member = (id: string, allow: bigint, deny = 0n): Overwrite => ({
  id,
  type: 1,
  allow: allow.toString(),
  deny: deny.toString(),
});

function guildId() {
  const id = process.env.DISCORD_GUILD_ID;
  if (!id) throw new Error("DISCORD_GUILD_ID not set");
  return id;
}

// 서버에 없는 유저는 권한을 줄 수 없으니 뺀다.
async function onlyGuildMembers(guild: string, ids: string[]) {
  const found = await Promise.all(
    ids.map((id) => botApi(`/guilds/${guild}/members/${id}`).then(() => id, () => null)),
  );
  return found.filter((id): id is string => id !== null);
}

// 카테고리 "세션 N · 제목" + 하위 채널 5개. N은 진행 중(아카이브 안 된) 세션의 빈 번호 중 가장 작은 것.
export async function createDiscordSessionRooms({
  title,
  gmDiscordId,
  playerDiscordIds,
}: {
  title: string;
  gmDiscordId: string;
  playerDiscordIds: string[];
}): Promise<string> {
  const guild = guildId();
  const [me, channels, [gmId], playerIds] = await Promise.all([
    botApi<{ id: string }>("/users/@me"),
    botApi<DiscordChannel[]>(`/guilds/${guild}/channels`),
    onlyGuildMembers(guild, [gmDiscordId]),
    onlyGuildMembers(guild, playerDiscordIds),
  ]);

  const used = new Set(
    channels
      .filter((c) => c.type === CATEGORY)
      .map((c) => Number(ACTIVE_NAME.exec(c.name)?.[1]))
      .filter(Boolean),
  );
  let n = 1;
  while (used.has(n)) n++;

  const base: Overwrite[] = [
    { id: guild, type: 0, allow: "0", deny: VIEW.toString() }, // @everyone 역할 id = 서버 id
    member(me.id, BOT),
  ];
  const gm = gmId ? [member(gmId, MEMBER)] : [];
  const everyone = [...gm, ...playerIds.map((id) => member(id, MEMBER))];

  const create = (name: string, type: number, overwrites: Overwrite[], parentId?: string) =>
    botApi<{ id: string }>(`/guilds/${guild}/channels`, {
      method: "POST",
      body: { name, type, parent_id: parentId, permission_overwrites: [...base, ...overwrites] },
    });

  const category = await create(`세션 ${n} · ${title}`.slice(0, 100), CATEGORY, everyone);
  const created = [category.id];
  try {
    const rooms: [string, number, Overwrite[]][] = [
      ["🔒GM-CHAT", TEXT, gm],
      ["💬PLAYER-CHAT", TEXT, everyone],
      ["📜INFO", TEXT, everyone],
      ["🎙️GM-VOICE", VOICE, gm],
      ["🔊PLAYER-VOICE", VOICE, everyone],
    ];
    for (const [name, type, overwrites] of rooms) {
      created.push((await create(name, type, overwrites, category.id)).id);
    }
  } catch (err) {
    // 반쯤 만들어진 채널은 치운다 (카테고리를 지워도 하위 채널은 남는다).
    await Promise.allSettled(created.map((id) => botApi(`/channels/${id}`, { method: "DELETE" })));
    throw err;
  }
  return category.id;
}

// 참여자 권한을 모두 걷어낸다. 기록은 남기고, GM만 읽기 전용으로 볼 수 있다.
export async function archiveDiscordSessionRooms(categoryId: string, gmDiscordId: string) {
  const guild = guildId();
  const [me, channels] = await Promise.all([
    botApi<{ id: string }>("/users/@me"),
    botApi<DiscordChannel[]>(`/guilds/${guild}/channels`),
  ]);

  const permission_overwrites: Overwrite[] = [
    { id: guild, type: 0, allow: "0", deny: VIEW.toString() },
    member(me.id, BOT),
    member(gmDiscordId, VIEW | HISTORY, SEND | CONNECT),
  ];

  for (const c of channels.filter((c) => c.id === categoryId || c.parent_id === categoryId)) {
    // 카테고리 이름을 바꿔 "세션 N" 번호를 비운다.
    const rename =
      c.id === categoryId && !c.name.startsWith(ARCHIVED_PREFIX)
        ? { name: `${ARCHIVED_PREFIX}${c.name}`.slice(0, 100) }
        : {};
    await botApi(`/channels/${c.id}`, {
      method: "PATCH",
      body: { ...rename, permission_overwrites },
    });
  }
}
