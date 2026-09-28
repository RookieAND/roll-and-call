import type { DiscordFile } from "../model/discord-types";

// 첨부가 있는 요청. JSON은 payload_json에, 파일은 files[n]에 담는다.
export async function discordBotFormApi<T>(
  path: string,
  { method, payload, files }: { method: string; payload: object; files: DiscordFile[] },
) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN not set");
  const form = new FormData();
  form.append(
    "payload_json",
    JSON.stringify({
      ...payload,
      attachments: files.map((file, index) => ({ id: index, filename: file.name })),
      allowed_mentions: { parse: [] },
    }).replace(/@(everyone|here)\b/g, ""),
  );
  files.forEach((file, index) => form.append(`files[${index}]`, file.blob, file.name));
  const response = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: { authorization: `Bot ${token}` },
    body: form,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    throw new Error(`Discord ${method} ${path} → ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T;
}
