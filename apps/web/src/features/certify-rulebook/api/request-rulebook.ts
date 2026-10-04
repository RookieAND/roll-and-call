"use server";

import { getMemberNickname } from "@roll-and-call/database/profiles";
import {
  createRulebookRequest,
  findRulebookCategoryId,
  hasPendingRulebookRequest,
} from "@roll-and-call/database/rulebooks";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notMemberError,
  postStaffNotice,
  STAFF_NOTICE_KIND,
} from "@/shared/server";

import {
  rulebookRequestSchema,
  UNKNOWN,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";

export async function requestRulebook(input: RulebookRequestValues): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  const parsed = rulebookRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." };
  const { name, edition, kind, category, link } = parsed.data;

  if (await hasPendingRulebookRequest({ serverId: server.id, name, edition })) {
    return { error: "이미 요청된 룰북입니다." };
  }

  const knownCategoryId = category
    ? await findRulebookCategoryId({ serverId: server.id, name: category })
    : null;
  await createRulebookRequest({
    serverId: server.id,
    request: {
      userId: user.id,
      name,
      edition,
      kind: kind === UNKNOWN ? null : kind,
      categoryId: knownCategoryId,
      categoryName: knownCategoryId || !category ? null : category,
      note: link ? `참고 링크 ${link}` : "",
    },
  });
  revalidatePath(serverPath({ slug: server.slug, path: "/me/rulebooks" }), "layout");
  after(async () => {
    const requesterNickname = await getMemberNickname({ serverId: server.id, userId: user.id });
    await postStaffNotice({
      server,
      notice: {
        kind: STAFF_NOTICE_KIND.rulebookRequested,
        requesterNickname: requesterNickname ?? "",
        name,
        edition,
      },
    });
  });
  return {};
}
