"use server";

import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  db,
  games,
  getCurrentUser,
  participants,
  refreshRecruitPost,
  removeUnusedGameFiles,
} from "@/shared/server";

import { gameFormSchema, INVALID_INPUT_MESSAGE, type GameFormValues } from "../model/game-form";
import { toGameColumns } from "../model/to-game-columns";

const FORBIDDEN_MESSAGE = "수정 권한이 없습니다.";

export async function updateGame(id: string, input: GameFormValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT_MESSAGE };
  }
  const values = parsed.data;

  const [before] = await db
    .select({
      thumbnailUrl: games.thumbnailUrl,
      images: games.images,
      scheduleMode: games.scheduleMode,
    })
    .from(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)));
  if (!before) return { error: FORBIDDEN_MESSAGE };

  const roster = await db
    .select({ status: participants.status })
    .from(participants)
    .where(eq(participants.gameId, id));
  const confirmedCount = roster.filter(
    (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
  ).length;

  if (Number(values.maxPlayers) < confirmedCount) {
    return {
      error: `이미 확정된 참여자가 ${confirmedCount}명이라 정원을 그보다 줄일 수 없습니다.`,
      field: "maxPlayers",
    };
  }
  // 조율 응답·확정 명단이 일정 방식에 묶여 있어 신청자가 있으면 방식을 바꿀 수 없다.
  if (roster.length > 0 && values.scheduleMode !== before.scheduleMode) {
    return {
      error:
        "신청자가 있어 일정 방식은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔주세요.",
      field: "scheduleMode",
    };
  }

  const updated = await db
    .update(games)
    .set(toGameColumns(values))
    .where(and(eq(games.id, id), eq(games.gmId, user.id)))
    .returning({ id: games.id });

  if (updated.length === 0) return { error: FORBIDDEN_MESSAGE };
  await refreshRecruitPost(id);

  const kept = new Set<string>([values.thumbnailUrl ?? "", ...values.images]);
  await removeUnusedGameFiles(
    [before.thumbnailUrl, ...before.images].filter((url) => url !== null && !kept.has(url)),
  );

  return { redirect: `/games/${id}` };
}
