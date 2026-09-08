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

type AnnouncementInput = {
  content?: string;
  embeds?: DiscordEmbed[];
  // Discord user IDs to actually ping (allowed_mentions allowlist).
  userMentions?: string[];
};

export async function sendDiscordAnnouncement({
  content,
  embeds,
  userMentions = [],
}: AnnouncementInput) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    console.warn("DISCORD_WEBHOOK_URL not set; skipping announcement");
    return;
  }

  // 알림 실패가 유저 동작(개설/신청)을 막으면 안 된다 — 타임아웃 걸고, 실패는 삼킨다.
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content,
        embeds,
        allowed_mentions: { parse: [], users: userMentions },
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.warn("Discord announcement failed:", err);
  }
}
