"use server";

import { and, desc, eq } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certApplications, db, getCurrentUser, removeUnusedCertPhotos } from "@/shared/server";

// 심사 중인 신청을 거둔다. 여러 권을 함께 냈으면 같은 묶음의 심사 중인 신청을 모두 거두고, 올린 사진도 지운다.
export async function withdrawApplication(rulebookId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const [latest] = await db
    .select({
      id: certApplications.id,
      groupId: certApplications.groupId,
      status: certApplications.status,
    })
    .from(certApplications)
    .where(and(eq(certApplications.userId, user.id), eq(certApplications.rulebookId, rulebookId)))
    .orderBy(desc(certApplications.createdAt))
    .limit(1);
  if (latest?.status !== "pending") {
    return { error: "운영진이 이미 처리한 신청입니다. 화면을 새로 고쳐 주세요." };
  }
  const deleted = await db
    .delete(certApplications)
    .where(
      and(
        eq(certApplications.userId, user.id),
        eq(certApplications.status, "pending"),
        latest.groupId
          ? eq(certApplications.groupId, latest.groupId)
          : eq(certApplications.id, latest.id),
      ),
    )
    .returning({
      photoUrls: certApplications.photoUrls,
      captureUrl: certApplications.purchaseCaptureUrl,
      receiptUrl: certApplications.receiptUrl,
    });
  if (deleted.length === 0)
    return { error: "운영진이 이미 처리한 신청입니다. 화면을 새로 고쳐 주세요." };
  await removeUnusedCertPhotos(
    user.id,
    deleted.flatMap((row) => [
      ...Object.values(row.photoUrls),
      row.captureUrl ?? "",
      row.receiptUrl ?? "",
    ]),
  );
  return { redirect: "/me/rulebooks" };
}
