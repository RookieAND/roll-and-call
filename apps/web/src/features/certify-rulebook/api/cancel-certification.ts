"use server";

import { and, eq } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certApplications, db, getCurrentUser, removeUnusedCertPhotos } from "@/shared/server";

// 확인 중인 신청만 취소한다. 올린 사진도 함께 지운다.
export async function cancelCertification(rulebookId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const deleted = await db
    .delete(certApplications)
    .where(
      and(
        eq(certApplications.userId, user.id),
        eq(certApplications.rulebookId, rulebookId),
        eq(certApplications.status, "pending"),
      ),
    )
    .returning({ photoUrls: certApplications.photoUrls });
  if (deleted.length === 0) return { error: "이미 처리된 신청입니다. 화면을 새로 고쳐 주세요." };

  await removeUnusedCertPhotos(
    user.id,
    deleted.flatMap((row) => Object.values(row.photoUrls)),
  );
  return { redirect: "/me/rulebooks" };
}
