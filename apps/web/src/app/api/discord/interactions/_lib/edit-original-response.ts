import type { DiscordInteraction } from "./interaction-types";

// 인터랙션 토큰이 인증을 대신하므로 봇 토큰이 필요 없다.
export async function editOriginalResponse({
  interaction,
  content,
}: {
  interaction: DiscordInteraction;
  content: string;
}) {
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
    },
  );
  if (!response.ok) console.error("디스코드 응답 수정 실패", response.status);
}
