import { createClient } from "npm:@supabase/supabase-js@2";

import { renderMessageHead, roleMentionIds } from "./render-message-head.ts";

// pg_cron이 5분마다 부른다(packages/database/drizzle/0040_session_reminder_cron.sql).
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN");
const SITE_URL = Deno.env.get("SITE_URL");

const ONE_HOUR_MS = 60 * 60 * 1000;
const RECRUIT_COLOR = 0x5865f2;
const HEAD_CASE_KEY = "remind";
const TEXT_KEY = "remind";
// packages/database/src/modules/servers/model/message-texts.ts의 remind 기본 문장과 같게 둔다.
const DEFAULT_DESCRIPTION = "세션이 곧 시작해요!";

type DueGame = {
  id: string;
  title: string;
  rule: string;
  confirmed_at: string;
  discord_thread_id: string;
  server_id: string;
  gm_id: string;
  server: { slug: string };
  gm: { discord_id: string; username: string } | null;
  participants: { status: string; user: { discord_id: string } | null }[];
};

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
      .map((part) => [part.type, part.value]),
  );
  return `${parts.month}월 ${parts.day}일 (${parts.weekday}) ${parts.hour}:${parts.minute}`;
}

function messageValues(game: DueGame, gmName: string): Record<string, string> {
  return {
    "구인 제목": game.title,
    GM: gmName,
    룰: game.rule,
    링크: `${SITE_URL}/${game.server.slug}/games/${game.id}`,
  };
}

// 서버가 정한 「1시간 전 알림」 머리 줄(server_message_heads). 없거나 못 읽으면 머리 줄 없이 보낸다.
async function headLine(game: DueGame, gmName: string) {
  const { data, error } = await supabase
    .from("server_message_heads")
    .select("head_line")
    .eq("server_id", game.server_id)
    .eq("case_key", HEAD_CASE_KEY)
    .maybeSingle<{ head_line: string }>();
  if (error) console.warn(`message head read failed for ${game.server_id}:`, error.message);
  return renderMessageHead({
    template: data?.head_line ?? "",
    values: messageValues(game, gmName),
  });
}

// 서버가 정한 임베드 설명 문장(server_message_texts). 없거나 못 읽거나 비면 기본 문장을 쓴다.
async function descriptionText(game: DueGame, gmName: string) {
  const { data, error } = await supabase
    .from("server_message_texts")
    .select("body")
    .eq("server_id", game.server_id)
    .eq("text_key", TEXT_KEY)
    .maybeSingle<{ body: string }>();
  if (error) console.warn(`message text read failed for ${game.server_id}:`, error.message);
  const values = messageValues(game, gmName);
  return (
    renderMessageHead({ template: data?.body ?? "", values }) ||
    renderMessageHead({ template: DEFAULT_DESCRIPTION, values })
  );
}

async function sendReminder(game: DueGame, gmName: string) {
  const mentionIds = [
    game.gm?.discord_id,
    ...game.participants
      .filter((participant) => participant.status === "confirmed")
      .map((participant) => participant.user?.discord_id),
  ].filter((discordId): discordId is string => !!discordId);

  const [head, description] = await Promise.all([
    headLine(game, gmName),
    descriptionText(game, gmName),
  ]);
  const roleIds = roleMentionIds(head);
  const content =
    [head, mentionIds.map((discordId) => `<@${discordId}>`).join(" ")].filter(Boolean).join("\n") ||
    undefined;

  const response = await fetch(
    `https://discord.com/api/v10/channels/${game.discord_thread_id}/messages`,
    {
      method: "POST",
      headers: { authorization: `Bot ${BOT_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({
        content,
        embeds: [
          {
            title: `⏰ ${game.title}`,
            url: `${SITE_URL}/${game.server.slug}/games/${game.id}`,
            description,
            color: RECRUIT_COLOR,
            fields: [
              { name: "📜 룰", value: game.rule, inline: true },
              { name: "🕒 시간", value: formatKst(game.confirmed_at), inline: true },
            ],
            footer: { text: `GM ${gmName}` },
            timestamp: new Date().toISOString(),
          },
        ],
        allowed_mentions: { parse: [], users: mentionIds, roles: roleIds },
      }).replace(/@(everyone|here)\b/g, ""),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error(`Discord ${response.status} ${await response.text()}`);
}

// 닉네임은 서버별(server_members.nickname)이다. 멤버십이 없으면 계정 이름으로 대신한다.
async function gmNickname(game: DueGame) {
  const { data } = await supabase
    .from("server_members")
    .select("nickname")
    .eq("server_id", game.server_id)
    .eq("user_id", game.gm_id)
    .maybeSingle<{ nickname: string }>();
  return data?.nickname;
}

Deno.serve(async () => {
  // 시크릿이 빠진 채로 가져가면 알림이 보내지지도 않고 사라진다.
  if (!BOT_TOKEN || !SITE_URL) {
    return Response.json({ error: "DISCORD_BOT_TOKEN/SITE_URL not set" }, { status: 500 });
  }
  const now = new Date();

  // 먼저 notified_at을 채워 가져가므로 겹쳐 돌아도 두 번 보내지 않는다.
  const { data, error } = await supabase
    .from("games")
    .update({ notified_at: now.toISOString() })
    .not("confirmed_at", "is", null)
    .not("discord_thread_id", "is", null)
    .is("notified_at", null)
    .is("hidden_at", null)
    .is("cancelled_at", null)
    .gt("confirmed_at", now.toISOString())
    .lte("confirmed_at", new Date(now.getTime() + ONE_HOUR_MS).toISOString())
    .select(
      "id, title, rule, confirmed_at, discord_thread_id, server_id, gm_id, server:servers!games_server_id_servers_id_fk(slug), gm:profiles!games_gm_id_profiles_id_fk(discord_id, username), participants!participants_game_id_games_id_fk(status, user:profiles!participants_user_id_profiles_id_fk(discord_id))",
    )
    .returns<DueGame[]>();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const failed: string[] = [];
  for (const game of data) {
    try {
      await sendReminder(game, (await gmNickname(game)) ?? game.gm?.username ?? "?");
    } catch (sendError) {
      // 되돌려 두면 세션이 시작하기 전까지 다음 주기에 다시 보낸다.
      console.warn(`reminder failed for ${game.id}:`, sendError);
      failed.push(game.id);
      await supabase.from("games").update({ notified_at: null }).eq("id", game.id);
    }
  }
  return Response.json({ claimed: data.length, failed });
});
