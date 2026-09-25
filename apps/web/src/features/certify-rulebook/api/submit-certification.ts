"use server";

import { and, desc, eq, inArray } from "drizzle-orm";

import { CERT_SHOTS } from "@/entities/rulebook";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certPhotoPathOf } from "@/shared/lib";
import { certApplications, certifications, db, getCurrentUser, rulebooks } from "@/shared/server";

import type { CertPhotos } from "../model/cert-photos";
import type { PurchaseRecord } from "../model/purchase-record";

const MAX_BOOKS = 10;

// 여러 권이면 권마다 한 건씩 넣고 같은 사진·구매 기록과 groupId를 나눠 쓴다.
// ponytail: 같은 룰북을 두 번 눌러 동시에 내는 경우는 막지 않는다. 운영진이 한 건을 반려하면 된다.
export async function submitCertification(
  rulebookIds: string[],
  photos: CertPhotos,
  purchase: PurchaseRecord,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const ids = [...new Set(rulebookIds)];
  if (ids.length === 0 || ids.length > MAX_BOOKS) return { error: "룰북을 다시 선택해 주세요." };
  const ownFile = (url: string) => certPhotoPathOf(url)?.startsWith(`${user.id}/`) ?? false;
  if (!CERT_SHOTS.every((shot) => ownFile(photos[shot] ?? ""))) {
    return { error: "사진 3장을 모두 올려 주세요." };
  }
  if (purchase.captureUrl && !ownFile(purchase.captureUrl)) {
    return { error: "구매 페이지 캡처를 다시 올려 주세요." };
  }

  const [books, certified, applications] = await Promise.all([
    db
      .select({
        id: rulebooks.id,
        categoryId: rulebooks.categoryId,
        certRequired: rulebooks.certRequired,
        hidden: rulebooks.hidden,
      })
      .from(rulebooks)
      .where(inArray(rulebooks.id, ids)),
    db
      .select({ rulebookId: certifications.rulebookId, revokedAt: certifications.revokedAt })
      .from(certifications)
      .where(and(eq(certifications.userId, user.id), inArray(certifications.rulebookId, ids))),
    db
      .select()
      .from(certApplications)
      .where(and(eq(certApplications.userId, user.id), inArray(certApplications.rulebookId, ids)))
      .orderBy(desc(certApplications.createdAt)),
  ]);
  if (books.length !== ids.length || books.some((book) => book.hidden)) {
    return { error: "룰북을 다시 선택해 주세요." };
  }
  if (new Set(books.map((book) => book.categoryId)).size > 1) {
    return { error: "한 번에는 같은 룰의 책만 신청할 수 있습니다." };
  }
  if (books.some((book) => !book.certRequired)) {
    return { error: "인증 없이 구인을 열 수 있는 룰입니다." };
  }
  if (certified.some((row) => !row.revokedAt)) return { error: "이미 인증된 룰북입니다." };

  const latestOf = (rulebookId: string) =>
    applications.find((application) => application.rulebookId === rulebookId);
  if (ids.some((id) => latestOf(id)?.status === "pending")) {
    return { error: "확인 중인 신청이 있습니다." };
  }

  const groupId = ids.length > 1 ? crypto.randomUUID() : null;
  await db.insert(certApplications).values(
    ids.map((rulebookId) => {
      const latest = latestOf(rulebookId);
      const previous = latest?.status === "rejected" ? latest.photoUrls : null;
      return {
        userId: user.id,
        rulebookId,
        groupId,
        photoUrls: photos,
        replacedShots: previous ? CERT_SHOTS.filter((shot) => previous[shot] !== photos[shot]) : [],
        purchaseCaptureUrl: purchase.captureUrl || null,
        orderNumber: purchase.orderNumber.trim().slice(0, 100) || null,
        orderDate: purchase.orderDate.trim().slice(0, 20) || null,
      };
    }),
  );
  return { redirect: `/me/rulebooks/${ids[0]}/submitted` };
}
