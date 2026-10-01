"use server";

import {
  findOwnedGameSettings,
  listRosterStatuses,
  updateOwnedGame,
} from "@roll-and-call/database/web";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  getCurrentServer,
  getCurrentUser,
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

  const server = await getCurrentServer();
  const owner = { serverId: server.id, gameId: id, gmId: user.id };
  const before = await findOwnedGameSettings(owner);
  if (!before) return { error: FORBIDDEN_MESSAGE };

  const roster = await listRosterStatuses({ serverId: server.id, gameId: id });
  const confirmedCount = roster.filter((status) => status === PARTICIPANT_STATUS.confirmed).length;

  if (Number(values.maxPlayers) < confirmedCount) {
    return {
      error: `이미 확정된 참여자가 ${confirmedCount}명이라 정원을 그보다 줄일 수 없습니다.`,
      field: "maxPlayers",
    };
  }
  // 조율 응답·확정 명단이 일정 방식에, 확정 순서가 모집 방식에 묶여 있어 신청자가 있으면 못 바꾼다.
  if (roster.length > 0 && values.scheduleMode !== before.scheduleMode) {
    return {
      error:
        "신청자가 있어 일정 방식은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔주세요.",
      field: "scheduleMode",
    };
  }
  if (roster.length > 0 && values.recruitMethod !== before.recruitMethod) {
    return {
      error:
        "신청자가 있어 모집 방식은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔주세요.",
      field: "recruitMethod",
    };
  }

  const updated = await updateOwnedGame({ ...owner, columns: toGameColumns(values) });
  if (!updated) return { error: FORBIDDEN_MESSAGE };
  after(() => refreshRecruitPost({ server, gameId: id }));

  const kept = new Set<string>([values.thumbnailUrl ?? "", ...values.images]);
  await removeUnusedGameFiles({
    serverId: server.id,
    urls: [before.thumbnailUrl, ...before.images].filter((url) => url !== null && !kept.has(url)),
  });

  redirect(`/games/${id}`);
}
