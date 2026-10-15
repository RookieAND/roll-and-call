import type { DiscordFile } from "../model/discord-types";
import { fetchDiscord } from "./fetch-discord";

// 첨부가 있는 요청. JSON은 payload_json에, 파일은 files[n]에 담는다.
export async function discordBotFormApi<T>({
  path,
  method,
  payload,
  files,
}: {
  path: string;
  method: string;
  payload: object;
  files: DiscordFile[];
}) {
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
  const response = await fetchDiscord({ path, method, headers: {}, body: form, timeoutMs: 20000 });
  return (await response.json()) as T;
}
