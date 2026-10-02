"use server";

import { deleteOwnedGame, isGameOwner } from "@roll-and-call/database/games";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  deleteGameReviewForumPosts,
  getActingMember,
  notifyGameCancelled,
  removeUnusedGameFiles,
  notMemberError,
} from "@/shared/server";

export async function deleteGame(id: string): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  const owner = { serverId: server.id, gameId: id, gmId: user.id };

  if (!(await isGameOwner(owner))) return { error: "삭제 권한이 없습니다." };
  await deleteGameReviewForumPosts({ serverId: server.id, gameId: id });

  const deleted = await deleteOwnedGame(owner);
  if (!deleted) return { error: "삭제 권한이 없습니다." };

  after(() => notifyGameCancelled({ server, game: deleted }));

  // 지운 게임의 썸네일·진행 이미지 파일도 정리한다. 2회차가 같은 파일을 쓰면 남는다.
  await removeUnusedGameFiles({
    serverId: server.id,
    urls: [deleted.thumbnailUrl, ...deleted.images],
  });

  redirect(serverPath({ slug: server.slug, path: "/games" }));
}
