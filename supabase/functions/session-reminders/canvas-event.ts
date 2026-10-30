import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

import { sendIntegrationEvent } from "./integration/send-integration-event.ts";

// packages/integrations/src/canvas/canvas-events.ts의 CANVAS_SOURCE·game.started 데이터와 같은 모양이다.
// Canvas가 포인트 규칙(구인 개설·미니룰 감산)을 정하므로 여기서는 사실만 알린다.
const CANVAS_SLUG = "canvas";
const CANVAS_SOURCE = "roll-and-call";
const GAME_STARTED = "game.started";

export type CanvasGame = {
  id: string;
  title: string;
  rulebook_id: string | null;
  server: { slug: string };
  gm: { discord_id: string } | null;
  participants: { status: string; user: { discord_id: string } | null }[];
};

// 룰북이 없는 구인은 미니룰로 센다. packages/database/src/modules/badges/model/mini-rule-of.ts와 같은 규칙이다.
async function isMiniRule({ supabase, game }: { supabase: SupabaseClient; game: CanvasGame }) {
  if (!game.rulebook_id) return true;
  const { data: rulebook } = await supabase
    .from("rulebooks")
    .select("category_id")
    .eq("id", game.rulebook_id)
    .maybeSingle<{ category_id: string | null }>();
  if (!rulebook?.category_id) return true;
  const { data: category } = await supabase
    .from("rulebook_categories")
    .select("mini_rule")
    .eq("id", rulebook.category_id)
    .maybeSingle<{ mini_rule: boolean }>();
  return category?.mini_rule ?? true;
}

// Canvas 서버의 구인이 시작되면 GM과 확정 참여자를 알린다. 연동 설정이 없거나 Canvas 서버가 아니면 아무것도 하지 않는다.
export async function sendCanvasGameStarted({
  supabase,
  game,
  now,
}: {
  supabase: SupabaseClient;
  game: CanvasGame;
  now: Date;
}) {
  const url = Deno.env.get("CANVAS_INTEGRATION_URL");
  const secret = Deno.env.get("CANVAS_INTEGRATION_SECRET");
  if (!url || !secret || game.server.slug !== CANVAS_SLUG || !game.gm) return;
  const result = await sendIntegrationEvent({
    target: { url, secret },
    source: CANVAS_SOURCE,
    type: GAME_STARTED,
    id: `${GAME_STARTED}:${game.id}`,
    now,
    data: {
      gameId: game.id,
      gameTitle: game.title,
      gmDiscordId: game.gm.discord_id,
      participantDiscordIds: game.participants
        .filter((participant) => participant.status === "confirmed")
        .flatMap((participant) => participant.user?.discord_id ?? []),
      miniRule: await isMiniRule({ supabase, game }),
    },
  });
  if (!result.ok) throw new Error(`Canvas ${result.error}`);
}
