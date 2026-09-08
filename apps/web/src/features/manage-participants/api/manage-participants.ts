"use server";

import { and, asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { db, games, participants } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";
import type { JoinActionResult } from "./join-game";

const { confirmed, waiting } = PARTICIPANT_STATUS;

function revalidate(gameId: string) {
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
}

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// 대기 → 확정 승격. 확정 정원이 이미 찼으면 가장 늦게 신청한 확정자를 대기로 밀어낸다.
export async function promoteParticipant(
  gameId: string,
  userId: string,
): Promise<JoinActionResult> {
  const gmId = await currentUserId();
  if (!gmId) return { error: "로그인이 필요합니다." };

  return db
    .transaction(async (tx) => {
      const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");
      if (!game) return { error: "존재하지 않는 게임입니다." };
      if (game.gmId !== gmId) return { error: "권한이 없습니다." };
      if (game.confirmedAt) return { error: "이미 확정된 게임입니다." };

      const [target] = await tx
        .select({ status: participants.status })
        .from(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
      if (!target) return { error: "참여자를 찾을 수 없습니다." };
      if (target.status === confirmed) return {};

      const confirmedCount = await tx.$count(
        participants,
        and(eq(participants.gameId, gameId), eq(participants.status, confirmed)),
      );
      if (confirmedCount >= game.maxPlayers) {
        const [last] = await tx
          .select({ userId: participants.userId })
          .from(participants)
          .where(and(eq(participants.gameId, gameId), eq(participants.status, confirmed)))
          .orderBy(desc(participants.joinedAt))
          .limit(1);
        if (last) {
          await tx
            .update(participants)
            .set({ status: waiting })
            .where(and(eq(participants.gameId, gameId), eq(participants.userId, last.userId)));
        }
      }

      await tx
        .update(participants)
        .set({ status: confirmed })
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
      return {};
    })
    .then((result) => {
      if (!result.error) revalidate(gameId);
      return result;
    });
}

// 확정 → 대기 강등. 빈 확정 자리는 대기열 맨 앞(가장 먼저 신청한 대기자)이 자동으로 채운다.
export async function demoteParticipant(gameId: string, userId: string): Promise<JoinActionResult> {
  const gmId = await currentUserId();
  if (!gmId) return { error: "로그인이 필요합니다." };

  return db
    .transaction(async (tx) => {
      const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");
      if (!game) return { error: "존재하지 않는 게임입니다." };
      if (game.gmId !== gmId) return { error: "권한이 없습니다." };
      if (game.confirmedAt) return { error: "이미 확정된 게임입니다." };

      const [target] = await tx
        .select({ status: participants.status })
        .from(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
      if (!target) return { error: "참여자를 찾을 수 없습니다." };
      if (target.status === waiting) return {};

      await tx
        .update(participants)
        .set({ status: waiting })
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));

      await promoteWaitlistHead(tx, gameId, userId);
      return {};
    })
    .then((result) => {
      if (!result.error) revalidate(gameId);
      return result;
    });
}

// GM이 참여자를 내보낸다. 확정자였다면 대기열 맨 앞이 빈 자리를 채운다.
export async function removeParticipant(gameId: string, userId: string): Promise<JoinActionResult> {
  const gmId = await currentUserId();
  if (!gmId) return { error: "로그인이 필요합니다." };

  return db
    .transaction(async (tx) => {
      const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");
      if (!game) return { error: "존재하지 않는 게임입니다." };
      if (game.gmId !== gmId) return { error: "권한이 없습니다." };
      if (game.confirmedAt) return { error: "이미 확정된 게임입니다." };

      const [removed] = await tx
        .delete(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)))
        .returning({ status: participants.status });
      if (!removed) return { error: "참여자를 찾을 수 없습니다." };

      if (removed.status === confirmed) {
        await promoteWaitlistHead(tx, gameId, userId);
      }
      return {};
    })
    .then((result) => {
      if (!result.error) revalidate(gameId);
      return result;
    });
}

// 대기열 맨 앞(target 제외)을 확정으로 올린다. 대기자가 없으면 아무것도 하지 않는다.
async function promoteWaitlistHead(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  gameId: string,
  excludeUserId: string,
) {
  const head = await tx
    .select({ userId: participants.userId })
    .from(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.status, waiting)))
    .orderBy(asc(participants.joinedAt));
  const next = head.find((h) => h.userId !== excludeUserId);
  if (!next) return;
  await tx
    .update(participants)
    .set({ status: confirmed })
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, next.userId)));
}
