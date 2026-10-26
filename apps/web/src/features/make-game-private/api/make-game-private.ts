"use server";

import { makeGamePrivate } from "@roll-and-call/database/games";
import { withTransaction } from "@roll-and-call/database/transaction";
import { deleteDiscordThread } from "@roll-and-call/discord";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { GAME_NOT_FOUND_RESULT, idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { VISIBILITY_SWITCH_MESSAGE } from "../model/visibility-switch-message";

// 공개에서 비공개로만 바꾼다. 올라가 있던 모집 공지는 지우고, 지우지 못해도 이미 저장한 공개 범위는 되돌리지 않는다.
export async function switchGameToPrivate(gameId: string): Promise<ActionResult> {
  const parsed = parseActionInput(idSchema, gameId);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;

  const result = await withTransaction((transaction) =>
    makeGamePrivate({
      transaction,
      serverId: server.id,
      gameId: parsed.data,
      gmId: user.id,
    }),
  );
  if (result.type === "notFound") return GAME_NOT_FOUND_RESULT;
  if (result.type === "blocked") return { error: VISIBILITY_SWITCH_MESSAGE[result.reason] };

  if (result.type === "changed" && result.removedThreadId) {
    const threadId = result.removedThreadId;
    after(async () => {
      try {
        await deleteDiscordThread(threadId);
      } catch (error) {
        console.error("비공개 전환 모집 공지 삭제 실패", { gameId: parsed.data, error });
      }
    });
  }

  const gamePath = serverPath({ slug: server.slug, path: `/games/${parsed.data}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/manage`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  revalidatePath(serverPath({ slug: server.slug, path: "/me/sessions" }));
  return {};
}
