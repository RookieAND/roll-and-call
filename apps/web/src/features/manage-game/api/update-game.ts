"use server";

import { and, eq } from "drizzle-orm";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { db, games, participants, getCurrentUser } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
import { gameFormSchema, type GameFormValues } from "../model/game-form";

export async function updateGame(id: string, values: GameFormValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const parsed = gameFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };
  }
  const v = parsed.data;

  const confirmedCount = await db.$count(
    participants,
    and(eq(participants.gameId, id), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
  );
  if (Number(v.maxPlayers) < confirmedCount) {
    return {
      error: `이미 확정된 참여자가 ${confirmedCount}명이라 정원을 그보다 줄일 수 없습니다.`,
    };
  }

  const updated = await db
    .update(games)
    .set({
      title: v.title,
      rule: v.rule,
      synopsis: v.synopsis || null,
      thumbnailUrl: v.thumbnailUrl || null,
      playTime: v.playTime || null,
      maxPlayers: Number(v.maxPlayers),
      scheduleMode: v.scheduleMode,
      endDate: new Date(v.endDate),
      rangeStart: v.rangeStart || null,
      rangeEnd: v.rangeEnd || null,
      confirmedAt: v.confirmedAt ? new Date(v.confirmedAt) : null,
    })
    .where(and(eq(games.id, id), eq(games.gmId, user.id)))
    .returning({ id: games.id });

  if (updated.length === 0) return { error: "수정 권한이 없습니다." };

  return { redirect: `/games/${id}` };
}
