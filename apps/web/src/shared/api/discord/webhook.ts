type AnnouncementInput = {
  content: string;
  // Discord user IDs to actually ping (allowed_mentions allowlist).
  userMentions?: string[];
};

export async function sendDiscordAnnouncement({
  content,
  userMentions = [],
}: AnnouncementInput) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    console.warn("DISCORD_WEBHOOK_URL not set; skipping announcement");
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content,
      allowed_mentions: { parse: [], users: userMentions },
    }),
  });
}
