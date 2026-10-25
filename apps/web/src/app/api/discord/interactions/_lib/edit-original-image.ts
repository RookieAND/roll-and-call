import type { DiscordInteraction } from "./interaction-types";

const FILENAME = "calendar.png";

// 이미지는 JSON이 아니라 multipart로 붙인다.
export async function editOriginalImage({
  interaction,
  image,
  content,
}: {
  interaction: DiscordInteraction;
  image: ArrayBuffer;
  content: string;
}) {
  const form = new FormData();
  form.append(
    "payload_json",
    JSON.stringify({
      content,
      attachments: [{ id: 0, filename: FILENAME }],
      allowed_mentions: { parse: [] },
    }),
  );
  form.append("files[0]", new Blob([image], { type: "image/png" }), FILENAME);
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
    { method: "PATCH", body: form, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok) console.error("디스코드 이미지 응답 수정 실패", response.status);
}
