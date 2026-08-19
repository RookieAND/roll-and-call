"use server";

import { and, eq } from "drizzle-orm";
import { db, games } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";

export type DeleteResult = { error?: string; redirect?: string };

export async function deleteGame(id: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  await db.delete(games).where(and(eq(games.id, id), eq(games.gmId, user.id)));

  return { redirect: "/games" };
}
