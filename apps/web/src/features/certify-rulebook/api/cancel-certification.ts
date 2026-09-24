"use server";

import { and, eq, inArray } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certApplications, db, getCurrentUser, removeUnusedCertPhotos } from "@/shared/server";

// 확인 중이거나 반려된 신청을 취소한다. 반려 기록이 남으면 예전 반려가 다시 보이므로 함께 지우고, 올린 사진도 지운다.
export async function cancelCertification(rulebookId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const deleted = await db
    .delete(certApplications)
    .where(
      and(
        eq(certApplications.userId, user.id),
        eq(certApplications.rulebookId, rulebookId),
        inArray(certApplications.status, ["pending", "rejected"]),
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
