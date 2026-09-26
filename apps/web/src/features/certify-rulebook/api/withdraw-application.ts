"use server";

import { and, desc, eq, ne } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certApplications, db, getCurrentUser, removeUnusedCertPhotos } from "@/shared/server";

const ALREADY_PROCESSED = "운영진이 이미 처리한 신청입니다. 화면을 새로 고쳐 주세요.";

// 심사 중인 신청을 거둔다. 행은 withdrawn으로 남겨 운영진이 거둔 사실을 보게 하고, 올린 사진은 지운다.
// 예전에 여러 권을 함께 낸 신청이면 같은 묶음의 심사 중인 신청을 모두 거둔다.
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
    .where(
      and(
        eq(certApplications.userId, user.id),
        eq(certApplications.rulebookId, rulebookId),
        ne(certApplications.status, "withdrawn"),
      ),
    )
    .orderBy(desc(certApplications.createdAt))
    .limit(1);
  if (latest?.status !== "pending") return { error: ALREADY_PROCESSED };
  const scope = and(
    eq(certApplications.userId, user.id),
    eq(certApplications.status, "pending"),
    latest.groupId
      ? eq(certApplications.groupId, latest.groupId)
      : eq(certApplications.id, latest.id),
  );
  const withdrawn = await db.transaction(async (transaction) => {
    const rows = await transaction
      .select({
        photoUrls: certApplications.photoUrls,
        captureUrl: certApplications.purchaseCaptureUrl,
        receiptUrl: certApplications.receiptUrl,
      })
      .from(certApplications)
      .where(scope)
      .for("update");
    await transaction
      .update(certApplications)
      .set({
        status: "withdrawn",
        processedAt: new Date(),
        photoUrls: {},
        purchaseCaptureUrl: null,
        receiptUrl: null,
      })
      .where(scope);
    return rows;
  });
  if (withdrawn.length === 0) return { error: ALREADY_PROCESSED };
  await removeUnusedCertPhotos(
    user.id,
    withdrawn.flatMap((row) => [
      ...Object.values(row.photoUrls),
      row.captureUrl ?? "",
      row.receiptUrl ?? "",
    ]),
  );
  return { redirect: "/me/rulebooks" };
}
