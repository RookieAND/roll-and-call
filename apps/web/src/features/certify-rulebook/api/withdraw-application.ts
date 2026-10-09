"use server";

import {
  findLatestCertApplication,
  withdrawPendingApplications,
} from "@roll-and-call/database/certifications";
import { redirect } from "next/navigation";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, removeUnusedCertPhotos, notMemberError } from "@/shared/server";

const ALREADY_PROCESSED = "운영진이 이미 처리한 신청입니다. 화면을 새로 고쳐 주세요.";

export async function withdrawApplication(input: string): Promise<ActionResult> {
  const parsed = parseActionInput(idSchema, input);
  if (!parsed.ok) return parsed.result;
  const rulebookId = parsed.data;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
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
  redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
}
