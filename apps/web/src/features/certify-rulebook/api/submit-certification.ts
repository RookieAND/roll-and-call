"use server";

import { and, desc, eq, isNull, or, sql } from "drizzle-orm";

import { CERT_FORMAT, CERT_SHOTS, RULEBOOK_KIND } from "@/entities/rulebook";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { certPhotoPathOf } from "@/shared/lib";
import {
  certApplications,
  certifications,
  db,
  getCurrentUser,
  rulebooks,
  sanctions,
} from "@/shared/server";

import type { CertEntry } from "../model/cert-entry";

const MAX_BOOKS = 10;

// 여러 권이면 권마다 한 건씩 넣고 groupId를 나눠 쓴다. 서플리먼트는 같은 판본 기본 룰북이 인증·심사 중이거나 함께 낼 때만 받는다.
// ponytail: 같은 책을 두 번 눌러 동시에 내는 경우는 막지 않는다. 운영진이 한 건을 반려하면 된다.
export async function submitCertification(entries: CertEntry[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const ids = [...new Set(entries.map((entry) => entry.rulebookId))];
  if (ids.length === 0 || ids.length !== entries.length || ids.length > MAX_BOOKS) {
    return { error: "책을 다시 골라 주세요." };
  }
  const ownFile = (url: string) => certPhotoPathOf(url)?.startsWith(`${user.id}/`) ?? false;
  for (const entry of entries) {
    if (entry.format === CERT_FORMAT.physical) {
      if (!CERT_SHOTS.every((shot) => ownFile(entry.photos[shot])))
        return { error: "사진 3장을 모두 올려 주세요." };
      if (entry.captureUrl && !ownFile(entry.captureUrl))
        return { error: "구매 기록 캡처를 다시 올려 주세요." };
    } else {
      if (!ownFile(entry.captureUrl) || !ownFile(entry.receiptUrl))
        return { error: "구매 내역과 영수증을 모두 올려 주세요." };
      if (!entry.seller.trim() || !entry.orderNumber.trim())
        return { error: "판매처와 주문번호를 적어 주세요." };
    }
  }

  const [books, certified, applications, [sanction]] = await Promise.all([
    db
      .select({
        id: rulebooks.id,
        categoryId: rulebooks.categoryId,
        edition: rulebooks.edition,
        kind: rulebooks.kind,
        certRequired: rulebooks.certRequired,
        hidden: rulebooks.hidden,
      })
      .from(rulebooks)
      .where(eq(rulebooks.hidden, false)),
    db
      .select({ rulebookId: certifications.rulebookId })
      .from(certifications)
      .where(and(eq(certifications.userId, user.id), isNull(certifications.revokedAt))),
    db
      .select({
        rulebookId: certApplications.rulebookId,
        status: certApplications.status,
        photoUrls: certApplications.photoUrls,
      })
      .from(certApplications)
      .where(eq(certApplications.userId, user.id))
      .orderBy(desc(certApplications.createdAt)),
    db
      .select({ id: sanctions.id })
      .from(sanctions)
      .where(
        and(
          eq(sanctions.userId, user.id),
          isNull(sanctions.releasedAt),
          or(isNull(sanctions.until), sql`${sanctions.until} > now()`),
        ),
      ),
  ]);
  if (sanction) return { error: "활동 정지 기간에는 인증을 신청할 수 없습니다." };

  const chosen = ids.flatMap((id) => books.find((book) => book.id === id) ?? []);
  if (chosen.length !== ids.length) return { error: "책을 다시 골라 주세요." };
  const [first] = chosen;
  if (
    chosen.some((book) => book.categoryId !== first!.categoryId || book.edition !== first!.edition)
  ) {
    return { error: "한 번에는 같은 판본의 책만 신청할 수 있습니다." };
  }
  if (chosen.some((book) => !book.certRequired))
    return { error: "인증 없이 구인을 열 수 있는 룰입니다." };
  const certifiedIds = new Set(certified.map((row) => row.rulebookId));
  if (ids.some((id) => certifiedIds.has(id))) return { error: "이미 인증된 룰북입니다." };
  const latestOf = (rulebookId: string) =>
    applications.find((application) => application.rulebookId === rulebookId);
  if (ids.some((id) => latestOf(id)?.status === "pending"))
    return { error: "심사 중인 신청이 있습니다." };
  const cores = books.filter(
    (book) =>
      book.kind === RULEBOOK_KIND.core &&
      book.categoryId === first!.categoryId &&
      book.edition === first!.edition,
  );
  const coreCovered = (core: { id: string }) =>
    certifiedIds.has(core.id) || latestOf(core.id)?.status === "pending" || ids.includes(core.id);
  if (chosen.some((book) => book.kind === RULEBOOK_KIND.supplement) && !cores.every(coreCovered)) {
    return { error: "같은 판본 기본 룰북을 먼저(또는 함께) 인증해야 합니다." };
  }

  const groupId = ids.length > 1 ? crypto.randomUUID() : null;
  await db.insert(certApplications).values(
    entries.map((entry) => {
      const latest = latestOf(entry.rulebookId);
      const previous = latest?.status === "rejected" ? latest.photoUrls : null;
      const physical = entry.format === CERT_FORMAT.physical;
      return {
        userId: user.id,
        rulebookId: entry.rulebookId,
        groupId,
        format: entry.format,
        photoUrls: physical ? entry.photos : {},
        replacedShots:
          previous && physical
            ? CERT_SHOTS.filter((shot) => previous[shot] !== entry.photos[shot])
            : [],
        seller: physical ? null : entry.seller.trim().slice(0, 100),
        purchaseCaptureUrl: entry.captureUrl || null,
        receiptUrl: physical ? null : entry.receiptUrl,
        orderNumber: entry.orderNumber.trim().slice(0, 100) || null,
        orderDate: entry.orderDate.trim().slice(0, 20) || null,
      };
    }),
  );
  return { redirect: `/me/rulebooks/${ids[0]}/submitted` };
}
