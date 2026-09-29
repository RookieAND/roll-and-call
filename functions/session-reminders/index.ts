import { createClient } from "npm:@supabase/supabase-js@2";

// pg_cron이 5분마다 부른다(packages/database/drizzle/0040_session_reminder_cron.sql).
// 1시간 안에 시작할 확정 세션을 recruit 채널에 알린다. 임베드 양식은 apps/web의 gameNoticeEmbed와 맞춘다.
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN");
const CHANNEL_ID = Deno.env.get("DISCORD_RECRUIT_CHANNEL_ID");
const SITE_URL = Deno.env.get("SITE_URL");

const ONE_HOUR_MS = 60 * 60 * 1000;
const RECRUIT_COLOR = 0x5865f2;

type DueGame = {
  id: string;
  title: string;
  rule: string;
  confirmed_at: string;
  gm: { discord_id: string; username: string } | null;
  participants: { status: string; user: { discord_id: string } | null }[];
};

// "10월 1일 (수) 20:00" — web의 formatDateTime과 같은 모양.
function formatKst(value: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(value))
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.month}월 ${parts.day}일 (${parts.weekday}) ${parts.hour}:${parts.minute}`;
}

async function sendReminder(game: DueGame) {
  const mentionIds = [
    game.gm?.discord_id,
    ...game.participants
      .filter((participant) => participant.status === "confirmed")
      .map((participant) => participant.user?.discord_id),
  ].filter((discordId): discordId is string => !!discordId);

  const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
    method: "POST",
    headers: { authorization: `Bot ${BOT_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({
      content: mentionIds.map((discordId) => `<@${discordId}>`).join(" ") || undefined,
      embeds: [
        {
          title: `⏰ ${game.title}`,
          url: `${SITE_URL}/games/${game.id}`,
          description: "세션이 곧 시작해요!",
          color: RECRUIT_COLOR,
          fields: [
            { name: "📜 룰", value: game.rule, inline: true },
            { name: "🕒 시간", value: formatKst(game.confirmed_at), inline: true },
          ],
          footer: { text: `GM ${game.gm?.username ?? "?"}` },
          timestamp: new Date().toISOString(),
        },
      ],
      allowed_mentions: { parse: [], users: mentionIds },
    }).replace(/@(everyone|here)\b/g, ""),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Discord ${response.status} ${await response.text()}`);
}

Deno.serve(async () => {
  // 시크릿이 빠진 채로 가져가면 알림이 보내지지도 않고 사라진다.
  if (!BOT_TOKEN || !CHANNEL_ID || !SITE_URL) {
    return Response.json(
      { error: "DISCORD_BOT_TOKEN/DISCORD_RECRUIT_CHANNEL_ID/SITE_URL not set" },
      { status: 500 },
    );
  }
  const now = new Date();

  // 먼저 notified_at을 채워 가져가므로 겹쳐 돌아도 두 번 보내지 않는다.
  // ponytail: 전송이 실패해도 다시 보내지 않는다. 알림 하나 빠지는 건 감수.
  const { data, error } = await supabase
    .from("games")
    .update({ notified_at: now.toISOString() })
    .not("confirmed_at", "is", null)
    .is("notified_at", null)
    .gt("confirmed_at", now.toISOString())
    .lte("confirmed_at", new Date(now.getTime() + ONE_HOUR_MS).toISOString())
    .select(
      "id, title, rule, confirmed_at, gm:profiles!games_gm_id_profiles_id_fk(discord_id, username), participants(status, user:profiles!participants_user_id_profiles_id_fk(discord_id))",
    )
    .returns<DueGame[]>();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const failed: string[] = [];
  for (const game of data) {
    try {
      await sendReminder(game);
    } catch (sendError) {
      console.warn(`reminder failed for ${game.id}:`, sendError);
      failed.push(game.id);
    }
  }
  return Response.json({ claimed: data.length, failed });
});
