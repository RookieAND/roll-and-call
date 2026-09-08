"use server";

import { and, eq } from "drizzle-orm";
import { db, games, createSupabaseServerClient } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
export async function deleteGame(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  await db.delete(games).where(and(eq(games.id, id), eq(games.gmId, user.id)));

  return { redirect: "/games" };
}
