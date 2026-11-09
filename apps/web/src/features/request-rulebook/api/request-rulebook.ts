"use server";

import { findActiveSanction } from "@roll-and-call/database/moderation";
import { getMemberIdentity } from "@roll-and-call/database/profiles";
import {
  createRulebookRequests,
  findRulebookCategoryId,
  saveRulebookRequestStaffMessage,
} from "@roll-and-call/database/rulebooks";
import { rulebookRequestKey } from "@roll-and-call/database/rulebooks/model";
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
  duplicateRequestErrors,
  REQUEST_KIND_CARDS,
  rulebookRequestsSchema,
  UNKNOWN,
  type RequestItemError,
  type RulebookRequestsInput,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";

type RequestResult = ActionResult & { itemErrors?: RequestItemError[]; createdCount?: number };

// 한 권 제출도 같은 검증과 트랜잭션을 사용한다.
export async function requestRulebook(input: RulebookRequestValues): Promise<RequestResult> {
  return requestRulebooks({ items: [{ ...input, clientId: "single" }] });
}

export async function requestRulebooks(input: RulebookRequestsInput): Promise<RequestResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  if (await findActiveSanction({ serverId: server.id, userId: user.id })) {
    return { error: "활동 정지 기간에는 룰북 추가를 요청할 수 없습니다." };
  }
  const parsed = rulebookRequestsSchema.safeParse(input);
  if (!parsed.success) {
    const itemErrors = parsed.error.issues.flatMap((issue) => {
      const index = issue.path[1];
      const clientId = typeof index === "number" ? input?.items?.[index]?.clientId : null;
      return typeof clientId === "string" ? [{ clientId, message: issue.message }] : [];
    });
    return { error: "입력 내용을 확인해 주세요.", itemErrors };
  }
  const { items } = parsed.data;
  const itemErrors = duplicateRequestErrors(items);
  if (itemErrors.length) return { error: "중복된 책을 확인해 주세요.", itemErrors };
  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))];
  const categoryIds = new Map(
    await Promise.all(
      categories.map(
        async (name) =>
          [name, await findRulebookCategoryId({ serverId: server.id, name })] as const,
      ),
    ),
  );
  const result = await createRulebookRequests({
    serverId: server.id,
    userId: user.id,
    requests: items.map(({ name, edition, kind, category, link }) => {
      const categoryId = categoryIds.get(category) ?? null;
      return {
        name,
        edition,
        kind: kind === UNKNOWN ? null : kind,
        categoryId,
        categoryName: categoryId || !category ? null : category,
        note: link ? `참고 링크 ${link}` : "",
      };
    }),
  });
  if (!result.ok) {
    const duplicates = new Set(result.duplicateKeys);
    return {
      error: "이미 검토 중인 책이 있어 아직 요청을 보내지 않았습니다.",
      itemErrors: items
        .filter((item) => duplicates.has(rulebookRequestKey(item)))
        .map((item) => ({
          clientId: item.clientId,
          message: "이미 검토 중인 룰북입니다. 이 항목을 제외해 주세요.",
        })),
    };
  }
  revalidatePath(serverPath({ slug: server.slug, path: "/me/rulebooks" }), "layout");
  after(async () => {
    const requester = await getMemberIdentity({ serverId: server.id, userId: user.id });
    if (!requester) return;
    // Discord 결과 수정은 권별 메시지를 사용한다. 한 건의 실패가 다음 전송을 막지 않는다.
    for (const [index, request] of result.requests.entries()) {
      const item = items[index]!;
      try {
        const message = await postStaffNotice({
          server,
          notice: {
            kind: STAFF_NOTICE_KIND.rulebookRequested,
            requesterNickname: requester.nickname,
            requesterDiscordId: requester.discordId,
            requesterAvatarUrl: requester.avatarUrl,
            name: item.name,
            edition: item.edition,
            kindLabel: REQUEST_KIND_CARDS.find((card) => card.value === item.kind)?.title ?? null,
            category: item.category,
            link: item.link,
          },
        });
        if (message)
          await saveRulebookRequestStaffMessage({
            serverId: server.id,
            id: request.id,
            messageId: message.id,
          });
      } catch (error) {
        console.error("룰북 추가 요청 운영진 알림 전송 실패", request.id, error);
      }
    }
  });
  return { createdCount: result.requests.length };
}
