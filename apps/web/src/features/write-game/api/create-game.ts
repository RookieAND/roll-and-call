"use server";

import { eq } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, games, getCurrentUser, notifyGameCreated } from "@/shared/server";

import { gameFormSchema, INVALID_INPUT_MESSAGE, type GameFormValues } from "../model/game-form";
import { toGameColumns } from "../model/to-game-columns";

export async function createGame(input: GameFormValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  // re-validate server-side (never trust the client)
  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT_MESSAGE };
  }

  const [created] = await db
    .insert(games)
    .values({ gmId: user.id, ...toGameColumns(parsed.data) })
    .returning({ id: games.id });
  const gameId = created!.id;

  const game = await db.query.games.findFirst({
    where: (table, { eq: equals }) => equals(table.id, gameId),
    with: { gm: { columns: { username: true } } },
  });
  const threadId = game && (await notifyGameCreated(game, game.gm?.username ?? "?"));
  if (threadId) {
    await db.update(games).set({ discordThreadId: threadId }).where(eq(games.id, gameId));
  }

  return { redirect: `/games/${gameId}` };
}
