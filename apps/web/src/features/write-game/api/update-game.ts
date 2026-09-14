"use server";

import { and, eq } from "drizzle-orm";
import { PARTICIPANT_STATUS } from "@/entities/game";
import {
  db,
  games,
  participants,
  getCurrentUser,
  refreshRecruitPost,
  removeUnusedGameFiles,
} from "@/shared/server";
import type { ActionResult } from "@/shared/api";
import { fromKstDateTimeInput } from "@/shared/lib";
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

  // 저장 뒤 빠진 파일을 지우려고 이전 썸네일·이미지를 먼저 읽어 둔다.
  const [before] = await db
    .select({ thumbnailUrl: games.thumbnailUrl, images: games.images })
    .from(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)));

  const updated = await db
    .update(games)
    .set({
      title: v.title,
      rule: v.rule,
      synopsis: v.synopsis || null,
      thumbnailUrl: v.thumbnailUrl || null,
      images: v.images,
      playTime: v.playTime || null,
      maxPlayers: Number(v.maxPlayers),
      waitlistEnabled: v.waitlistEnabled,
      scheduleMode: v.scheduleMode,
      endDate: fromKstDateTimeInput(v.endDate),
      rangeStart: v.rangeStart || null,
      rangeEnd: v.rangeEnd || null,
      confirmedAt: v.confirmedAt ? fromKstDateTimeInput(v.confirmedAt) : null,
    })
    .where(and(eq(games.id, id), eq(games.gmId, user.id)))
    .returning({ id: games.id });

  if (updated.length === 0) return { error: "수정 권한이 없습니다." };
  await refreshRecruitPost(id);

  // 교체·삭제된 썸네일과 진행 이미지 파일을 정리한다(다른 게임이 쓰는 파일은 남는다).
  if (before) {
    const kept = new Set<string>([v.thumbnailUrl ?? "", ...v.images]);
    await removeUnusedGameFiles(
      [before.thumbnailUrl, ...before.images].filter((url) => url !== null && !kept.has(url)),
    );
  }

  return { redirect: `/games/${id}` };
}
