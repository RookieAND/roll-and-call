"use server";

import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certApplications, db, getCurrentUser, removeUnusedCertPhotos } from "@/shared/server";

const NOT_REJECTED = "반려된 신청만 취소할 수 있습니다. 화면을 새로 고쳐 주세요.";

// 반려된 책의 신청 기록을 지운다. 앞선 반려가 남으면 다시 반려로 보이므로 반려·거둔 기록을 모두 지운다.
export async function discardRejectedApplication(rulebookId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const scope = and(
    eq(certApplications.userId, user.id),
    eq(certApplications.rulebookId, rulebookId),
  );

  const discarded = await db.transaction(async (transaction) => {
    const [latest] = await transaction
      .select({ status: certApplications.status })
      .from(certApplications)
      .where(and(scope, ne(certApplications.status, "withdrawn")))
      .orderBy(desc(certApplications.createdAt))
      .limit(1)
      .for("update");
    if (latest?.status !== "rejected") return null;
    return transaction
      .delete(certApplications)
      .where(and(scope, inArray(certApplications.status, ["rejected", "withdrawn"])))
      .returning({
        photoUrls: certApplications.photoUrls,
        captureUrl: certApplications.purchaseCaptureUrl,
        receiptUrl: certApplications.receiptUrl,
      });
  });
  if (!discarded) return { error: NOT_REJECTED };

  await removeUnusedCertPhotos(
    user.id,
    discarded.flatMap((row) => [
      ...Object.values(row.photoUrls),
      row.captureUrl ?? "",
      row.receiptUrl ?? "",
    ]),
  );
  revalidatePath("/me", "layout");
  return { redirect: "/me/rulebooks" };
}
