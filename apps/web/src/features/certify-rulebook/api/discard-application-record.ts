"use server";

import { discardRulebookRecord } from "@roll-and-call/database/certifications";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, removeUnusedCertPhotos, notMemberError } from "@/shared/server";

const NOT_DISCARDABLE =
  "반려되거나 인증이 취소된 책만 기록을 지울 수 있습니다. 화면을 새로 고쳐 주세요.";

export async function discardApplicationRecord(rulebookId: string): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const discarded = await discardRulebookRecord({
    serverId: server.id,
    userId: user.id,
    rulebookId,
  });
  if (!discarded) return { error: NOT_DISCARDABLE };

  await removeUnusedCertPhotos({
    serverId: server.id,
    userId: user.id,
    urls: discarded.flatMap((row) => [
      ...Object.values(row.photoUrls),
      row.captureUrl ?? "",
      row.receiptUrl ?? "",
    ]),
  });
  revalidatePath(serverPath({ slug: server.slug, path: "/me" }), "layout");
  redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
}
