"use server";

import {
  createRulebookRequest,
  findRulebookCategoryId,
  hasPendingRulebookRequest,
} from "@roll-and-call/database/web";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

import {
  rulebookRequestSchema,
  UNKNOWN,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";

export async function requestRulebook(input: RulebookRequestValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const parsed = rulebookRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." };
  const { name, edition, kind, category, link } = parsed.data;

  const server = await getCurrentServer();

  if (await hasPendingRulebookRequest({ serverId: server.id, name, edition })) {
    return { error: "이미 요청된 룰북입니다." };
  }

  const knownCategoryId = category ? await findRulebookCategoryId(category) : null;
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
  return {};
}
