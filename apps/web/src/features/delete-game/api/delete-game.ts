"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, games } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";

export async function deleteGame(id: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await db.delete(games).where(and(eq(games.id, id), eq(games.kpId, user.id)));

  redirect("/games");
}
