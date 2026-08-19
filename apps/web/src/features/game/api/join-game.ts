"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PARTICIPANT_STATUS } from "@/entities/game";
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
    const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");

    if (!game) return { error: "존재하지 않는 게임입니다." };
    if (game.gmId === user.id) {
      return { error: "GM은 참여자로 참여할 수 없습니다." };
    }
    if (game.confirmedAt) return { error: "이미 일정이 확정된 게임입니다." };
    if (game.endDate.getTime() <= Date.now()) {
      return { error: "모집이 마감되었습니다." };
    }

    // 정원까지는 confirmed, 초과분은 waiting(대기열)으로 받는다 — 거절하지 않는다.
    const confirmedCount = await tx.$count(
      participants,
      and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
    );
    const status =
      confirmedCount < game.maxPlayers ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting;

    const inserted = await tx
      .insert(participants)
      .values({ gameId, userId: user.id, status })
      .onConflictDoNothing()
      .returning({ userId: participants.userId });

    if (inserted.length === 0) return { error: "이미 참여 중입니다." };

    // 이번 참여로 확정 정원이 막 찼을 때만 구인 완료를 알린다.
    becameFull = status === PARTICIPANT_STATUS.confirmed && confirmedCount + 1 === game.maxPlayers;
    return {};
  });

  if (result.error) return result;

  if (becameFull) await announceRecruitmentComplete(gameId);

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/participants`);
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
