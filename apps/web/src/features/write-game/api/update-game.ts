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

  // 잠금 검사와 저장 뒤 파일 정리에 쓰려고 이전 값을 먼저 읽어 둔다.
  const [before] = await db
    .select({
      thumbnailUrl: games.thumbnailUrl,
      images: games.images,
      scheduleMode: games.scheduleMode,
    })
    .from(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)));
  if (!before) return { error: "수정 권한이 없습니다." };

  const roster = await db
    .select({ status: participants.status })
    .from(participants)
    .where(eq(participants.gameId, id));
  const confirmedCount = roster.filter((p) => p.status === PARTICIPANT_STATUS.confirmed).length;

  if (Number(v.maxPlayers) < confirmedCount) {
    return {
      error: `이미 확정된 참여자가 ${confirmedCount}명이라 정원을 그보다 줄일 수 없습니다.`,
      field: "maxPlayers",
    };
  }
  // 신청자가 있으면 일정 방식을 바꿀 수 없다. 조율 응답·확정 명단이 방식에 묶여 있기 때문이다(화면도 잠근다).
  if (roster.length > 0 && v.scheduleMode !== before.scheduleMode) {
    return {
      error: "신청자가 있어 일정 방식은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔주세요.",
      field: "scheduleMode",
    };
  }

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

  // 교체·삭제된 썸네일과 추가 이미지 파일을 정리한다(다른 게임이 쓰는 파일은 남는다).
  const kept = new Set<string>([v.thumbnailUrl ?? "", ...v.images]);
  await removeUnusedGameFiles(
    [before.thumbnailUrl, ...before.images].filter((url) => url !== null && !kept.has(url)),
  );

  return { redirect: `/games/${id}` };
}
