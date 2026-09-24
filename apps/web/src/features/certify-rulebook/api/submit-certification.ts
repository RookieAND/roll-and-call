"use server";

import { and, desc, eq } from "drizzle-orm";

import { CERT_SHOTS } from "@/entities/rulebook";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certPhotoPathOf } from "@/shared/lib";
import { certApplications, certifications, db, getCurrentUser, rulebooks } from "@/shared/server";

import type { CertPhotos } from "../model/cert-photos";

// ponytail: 같은 룰북을 두 번 눌러 동시에 내는 경우는 막지 않는다. 운영진이 한 건을 반려하면 된다.
export async function submitCertification(
  rulebookId: string,
  photos: CertPhotos,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const ownPhotos = CERT_SHOTS.every((shot) =>
    certPhotoPathOf(photos[shot] ?? "")?.startsWith(`${user.id}/`),
  );
  if (!ownPhotos) return { error: "사진 3장을 모두 올려 주세요." };

  const [rulebook] = await db
    .select({ certRequired: rulebooks.certRequired, hidden: rulebooks.hidden })
    .from(rulebooks)
    .where(eq(rulebooks.id, rulebookId));
  if (!rulebook || rulebook.hidden) return { error: "룰북을 다시 선택해 주세요." };
  if (!rulebook.certRequired) return { error: "인증 없이 구인을 열 수 있는 룰입니다." };

  const mine = and(
    eq(certApplications.userId, user.id),
    eq(certApplications.rulebookId, rulebookId),
  );
  const [[certification], [latest]] = await Promise.all([
    db
      .select({ revokedAt: certifications.revokedAt })
      .from(certifications)
      .where(and(eq(certifications.userId, user.id), eq(certifications.rulebookId, rulebookId))),
    db
      .select()
      .from(certApplications)
      .where(mine)
      .orderBy(desc(certApplications.createdAt))
      .limit(1),
  ]);
  if (certification && !certification.revokedAt) return { error: "이미 인증된 룰북입니다." };
  if (latest?.status === "pending") return { error: "확인 중인 신청이 있습니다." };

  const previous = latest?.status === "rejected" ? latest.photoUrls : null;
  await db.insert(certApplications).values({
    userId: user.id,
    rulebookId,
    photoUrls: photos,
    replacedShots: previous ? CERT_SHOTS.filter((shot) => previous[shot] !== photos[shot]) : [],
  });
  return { redirect: `/me/rulebooks/${rulebookId}/submitted` };
}
