"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, games, participants } from "@/shared/api/db";
import { sendDiscordAnnouncement } from "@/shared/api/discord/webhook";
import { createClient } from "@/shared/api/supabase/server";

export type JoinActionResult = { error?: string };

export async function joinGame(gameId: string): Promise<JoinActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  let becameFull = false;

  // ponytail: lock the game row so concurrent joins to the same game serialize
  // and can't overfill the last slot. Per-game throughput is tiny, so a row lock is plenty.
  const result: JoinActionResult = await db.transaction(async (tx) => {
    const [game] = await tx
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .for("update");

    if (!game) return { error: "존재하지 않는 게임입니다." };
    if (game.gmId === user.id) {
      return { error: "GM은 참여자로 참여할 수 없습니다." };
    }
    if (game.confirmedAt) return { error: "이미 일정이 확정된 게임입니다." };
    if (game.endDate.getTime() <= Date.now()) {
      return { error: "모집이 마감되었습니다." };
    }

    const count = await tx.$count(participants, eq(participants.gameId, gameId));
    if (count >= game.maxPlayers) return { error: "정원이 가득 찼습니다." };

    const inserted = await tx
      .insert(participants)
      .values({ gameId, userId: user.id })
      .onConflictDoNothing()
      .returning({ userId: participants.userId });

    if (inserted.length === 0) return { error: "이미 참여 중입니다." };

    becameFull = count + 1 >= game.maxPlayers;
    return {};
  });

  if (result.error) return result;

  if (becameFull) await announceRecruitmentComplete(gameId);

  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
  return {};
}

async function announceRecruitmentComplete(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    with: {
      gm: { columns: { discordId: true, username: true } },
      participants: { with: { user: { columns: { discordId: true } } } },
    },
  });
  if (!game) return;

  const mentionIds = [
    game.gm?.discordId,
    ...game.participants.map((p) => p.user?.discordId),
  ].filter((id): id is string => Boolean(id));

  const mentions = mentionIds.map((id) => `<@${id}>`).join(" ");
  const content =
    `🎲 **${game.title}** 구인 완료! (${game.maxPlayers}/${game.maxPlayers})\n` +
    `룰: ${game.rule} · GM: ${game.gm?.username ?? "?"}\n${mentions}`;

  await sendDiscordAnnouncement({ content, userMentions: mentionIds });
}
