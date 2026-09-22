import "server-only";
import { db, games } from "@roll-and-call/database";
import { arrayOverlaps, inArray, or } from "drizzle-orm";
import { compact, uniq } from "es-toolkit";

import { GAME_IMAGE_BUCKET, gameImagePathOf } from "@/shared/lib";

import { createSupabaseServerClient } from "./auth/create-supabase-server-client";

// 2회차는 이전 회차의 URL을 그대로 복사하므로, 아직 어느 게임이든 쓰는 URL은 남긴다.
// 사용자 세션으로 지우므로 스토리지 정책(owner = auth.uid())상 본인이 올린 파일만 지워진다.
// ponytail: best-effort. 실패하면 파일이 남을 뿐 저장·삭제는 막지 않는다.
// 등록하다 그만둔 업로드는 여기서 못 잡는다 — service-role 키로 도는 주기 정리가 필요하다.
export async function removeUnusedGameFiles(urls: (string | null)[]) {
  const candidates = uniq(compact(urls));
  if (candidates.length === 0) return;

  const stillUsed = await db
    .select({ thumbnailUrl: games.thumbnailUrl, images: games.images })
    .from(games)
    .where(or(inArray(games.thumbnailUrl, candidates), arrayOverlaps(games.images, candidates)));
  const inUse = new Set(stillUsed.flatMap((game) => [game.thumbnailUrl, ...game.images]));

  const paths = compact(candidates.filter((url) => !inUse.has(url)).map(gameImagePathOf));
  if (paths.length === 0) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(GAME_IMAGE_BUCKET).remove(paths);
  if (error) console.error("[game-files] storage remove failed:", error.message);
}
