"use server";

import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentUser, refreshRecruitPost } from "@/shared/server";

import { announceNewApplication } from "./announce-new-application";
import { announceRecruitmentComplete } from "./announce-recruitment-complete";
import { applyToGame } from "./apply-to-game";
import { seedAvailabilityFromProfile } from "./seed-availability-from-profile";

// waiting은 화면 표시 시점이 아니라 실제 접수 결과라 토스트 문구가 이걸 따른다.
export async function joinGame(gameId: string): Promise<ActionResult & { waiting?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const application = await applyToGame(gameId, user.id);
  if ("error" in application) return application;

  await seedAvailabilityFromProfile(application.game, user.id);
  await announceNewApplication(
    application.game,
    user.id,
    application.waiting,
    application.confirmedCount,
  );
  if (application.becameFull) await announceRecruitmentComplete(gameId);
  await refreshRecruitPost(gameId);

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}/schedule`);
  revalidatePath("/games");
  return { waiting: application.waiting };
}
