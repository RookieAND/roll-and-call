import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

import { sendCanvasGameStarted, type CanvasGame } from "./canvas-event.ts";
import { formatKst } from "./format-kst.ts";
import { renderMessageHead, roleMentionIds } from "./render-message-head.ts";

// 시작 시각이 지난 확정 구인의 스레드에 「세션 시작 안내」를 알림음 없이, 시스템 멘션 없이 한 번 올린다.
// 윈도우를 넘긴 구인(배포 직후·장애 복구 뒤 오래전 구인)에는 보내지 않는다.
const WINDOW_MS = 30 * 60 * 1000;
const RECRUIT_COLOR = 0x5865f2;
const MESSAGE_FLAG_SUPPRESS_NOTIFICATIONS = 1 << 12;
const HEAD_CASE_KEY = "start";
const TEXT_KEY = "start";
// packages/database/src/modules/games/model/session-timing.ts의 DEFAULT_PLAY_MINUTES와 같다.
const DEFAULT_PLAY_MINUTES = 180;
// packages/game-notices/src/notify/attendance-button.ts·review-button.ts와 같은 값이다.
const ATTENDANCE_BUTTON_PREFIX = "attendance:";
const REVIEW_BUTTON_PREFIX = "review:";
// packages/database/src/modules/servers/model/message-heads.ts·message-texts.ts의 start 기본 문구와 같게 둔다.
// start-notice-defaults.test.ts가 둘이 같은지 확인한다.
const DEFAULT_HEAD = "📢 세션이 시작되었습니다! 이제부터 후기 및 출석 처리가 가능합니다.";
const DEFAULT_DESCRIPTION =
  "GM은 출석을, 참여자는 후기를 지금부터 입력할 수 있습니다.\n후기는 세션이 끝난 뒤에도 마감 전까지 작성할 수 있습니다.";

type StartGame = CanvasGame & {
  rule: string;
  confirmed_at: string;
  play_minutes: number | null;
  discord_thread_id: string;
  server_id: string;
  gm_id: string;
  gm: { username: string; discord_id: string } | null;
};

interface Environment {
  supabase: SupabaseClient;
  botToken: string;
  siteUrl: string;
}

function messageValues({
  game,
  gmName,
  siteUrl,
}: {
  game: StartGame;
  gmName: string;
  siteUrl: string;
}) {
  return {
    "구인 제목": game.title,
    GM: gmName,
    룰: game.rule,
    링크: `${siteUrl}/${game.server.slug}/games/${game.id}`,
  };
}

async function gmNickname({ supabase, game }: { supabase: SupabaseClient; game: StartGame }) {
  const { data } = await supabase
    .from("server_members")
    .select("nickname")
    .eq("server_id", game.server_id)
    .eq("user_id", game.gm_id)
    .maybeSingle<{ nickname: string }>();
  return data?.nickname ?? game.gm?.username ?? "?";
}

// 서버가 저장한 행이 있으면 빈 문구도 그대로 쓴다(머리 줄을 없앤 것). 행이 없거나 못 읽으면 기본값이다.
async function headLine({
  supabase,
  game,
  values,
}: {
  supabase: SupabaseClient;
  game: StartGame;
  values: Record<string, string>;
}) {
  const { data, error } = await supabase
    .from("server_message_heads")
    .select("head_line")
    .eq("server_id", game.server_id)
    .eq("case_key", HEAD_CASE_KEY)
    .maybeSingle<{ head_line: string }>();
  if (error) console.warn(`start head read failed for ${game.server_id}:`, error.message);
  return renderMessageHead({ template: data?.head_line ?? DEFAULT_HEAD, values });
}

async function description({
  supabase,
  game,
  values,
}: {
  supabase: SupabaseClient;
  game: StartGame;
  values: Record<string, string>;
}) {
  const { data, error } = await supabase
    .from("server_message_texts")
    .select("body")
    .eq("server_id", game.server_id)
    .eq("text_key", TEXT_KEY)
    .maybeSingle<{ body: string }>();
  if (error) console.warn(`start text read failed for ${game.server_id}:`, error.message);
  return (
    renderMessageHead({ template: data?.body ?? "", values }) ||
    renderMessageHead({ template: DEFAULT_DESCRIPTION, values })
  );
}

async function sendStartNotice({
  environment,
  game,
}: {
  environment: Environment;
  game: StartGame;
}) {
  const { supabase, botToken, siteUrl } = environment;
  const gmName = await gmNickname({ supabase, game });
  const values = messageValues({ game, gmName, siteUrl });
  const [head, body] = await Promise.all([
    headLine({ supabase, game, values }),
    description({ supabase, game, values }),
  ]);
  const detailUrl = values["링크"];
  const endsAt = new Date(
    new Date(game.confirmed_at).getTime() + (game.play_minutes || DEFAULT_PLAY_MINUTES) * 60_000,
  ).toISOString();
  const userIds = [...head.matchAll(/<@!?(\d+)>/g)].flatMap((match) => match[1] ?? []);

  const response = await fetch(
    `https://discord.com/api/v10/channels/${game.discord_thread_id}/messages`,
    {
      method: "POST",
      headers: { authorization: `Bot ${botToken}`, "content-type": "application/json" },
      body: JSON.stringify({
        content: head || undefined,
        embeds: [
          {
            title: game.title,
            url: detailUrl,
            description: body,
            color: RECRUIT_COLOR,
            fields: [
              { name: "📜 룰", value: game.rule, inline: true },
              { name: "🕒 종료 예정", value: formatKst(endsAt), inline: true },
            ],
            footer: { text: `GM ${gmName}` },
            timestamp: new Date().toISOString(),
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3,
                emoji: { name: "✅" },
                label: "출석 입력하기",
                custom_id: `${ATTENDANCE_BUTTON_PREFIX}${game.id}`,
              },
              {
                type: 2,
                style: 1,
                emoji: { name: "📝" },
                label: "후기 작성하기",
                custom_id: `${REVIEW_BUTTON_PREFIX}${game.id}`,
              },
              {
                type: 2,
                style: 5,
                emoji: { name: "🌐" },
                label: "웹에서 작성하기",
                url: `${detailUrl}/review`,
              },
            ],
          },
        ],
        flags: MESSAGE_FLAG_SUPPRESS_NOTIFICATIONS,
        allowed_mentions: { parse: [], users: userIds, roles: roleMentionIds(head) },
      }).replace(/@(everyone|here)\b/g, ""),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error(`Discord ${response.status} ${await response.text()}`);
}

// start_notified_at을 먼저 채워 가져가므로 크론이 겹쳐 돌아도 두 번 보내지 않는다.
// 보내지 못하면 되돌려 두어, 윈도우 안이면 다음 주기에 다시 보낸다.
export async function sendStartNotices(environment: Environment, now: Date) {
  const { supabase } = environment;
  const { data, error } = await supabase
    .from("games")
    .update({ start_notified_at: now.toISOString() })
    .not("confirmed_at", "is", null)
    .not("discord_thread_id", "is", null)
    .eq("visibility", "public")
    .is("start_notified_at", null)
    .is("hidden_at", null)
    .is("cancelled_at", null)
    .lte("confirmed_at", now.toISOString())
    .gt("confirmed_at", new Date(now.getTime() - WINDOW_MS).toISOString())
    .select(
      "id, title, rule, rulebook_id, confirmed_at, play_minutes, discord_thread_id, server_id, gm_id, server:servers!games_server_id_servers_id_fk(slug), gm:profiles!games_gm_id_profiles_id_fk(username, discord_id), participants!participants_game_id_games_id_fk(status, user:profiles!participants_user_id_profiles_id_fk(discord_id))",
    )
    .returns<StartGame[]>();
  if (error) return { claimed: 0, failed: [] as string[], error: error.message };

  const failed: string[] = [];
  const canvasFailed: string[] = [];
  for (const game of data) {
    try {
      await sendStartNotice({ environment, game });
      // 시작 안내와 따로 실패를 센다. Canvas가 막혀도 안내는 다시 보내지 않는다(Canvas 쪽 지급은 같은 구인에 한 번만 들어간다).
      await sendCanvasGameStarted({ supabase, game, now }).catch((canvasError) => {
        console.warn(`canvas event failed for ${game.id}:`, canvasError);
        canvasFailed.push(game.id);
      });
    } catch (sendError) {
      console.warn(`start notice failed for ${game.id}:`, sendError);
      failed.push(game.id);
      await supabase.from("games").update({ start_notified_at: null }).eq("id", game.id);
    }
  }
  return { claimed: data.length, failed, canvasFailed };
}
