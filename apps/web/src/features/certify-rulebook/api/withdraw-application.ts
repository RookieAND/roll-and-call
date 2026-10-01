"use server";

import {
  findLatestCertApplication,
  withdrawPendingApplications,
} from "@roll-and-call/database/certifications";
import { redirect } from "next/navigation";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser, removeUnusedCertPhotos } from "@/shared/server";

const ALREADY_PROCESSED = "운영진이 이미 처리한 신청입니다. 화면을 새로 고쳐 주세요.";

export async function withdrawApplication(rulebookId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const server = await getCurrentServer();
  const latest = await findLatestCertApplication({
    serverId: server.id,
    userId: user.id,
    rulebookId,
  });
  if (latest?.status !== "pending") return { error: ALREADY_PROCESSED };
  const withdrawn = await withdrawPendingApplications({
    serverId: server.id,
    userId: user.id,
    application: latest,
  });
  if (withdrawn.length === 0) return { error: ALREADY_PROCESSED };
  await removeUnusedCertPhotos({
    serverId: server.id,
    userId: user.id,
    urls: withdrawn.flatMap((row) => [
      ...Object.values(row.photoUrls),
      row.captureUrl ?? "",
      row.receiptUrl ?? "",
    ]),
  });
  redirect("/me/rulebooks");
}
