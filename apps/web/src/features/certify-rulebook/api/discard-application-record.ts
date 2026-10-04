"use server";

import { discardRulebookRecord } from "@roll-and-call/database/certifications";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, removeUnusedCertPhotos, notMemberError } from "@/shared/server";

const NOT_DISCARDABLE = "반려된 책만 기록을 지울 수 있습니다. 화면을 새로 고쳐 주세요.";

// stay면 알림 탭에 남는다(할 일 카드). 그 밖에서는 내 룰북으로 간다.
export async function discardApplicationRecord({
  rulebookId,
  stay,
}: {
  rulebookId: string;
  stay: boolean;
}): Promise<ActionResult> {
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
  if (stay) {
    revalidatePath(serverPath({ slug: server.slug, path: "/notifications" }));
    return {};
  }
  redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
}
