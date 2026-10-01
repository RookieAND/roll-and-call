"use server";

import { deleteOwnedGame, isGameOwner } from "@roll-and-call/database/games";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  deleteGameReviewForumPosts,
  getCurrentServer,
  getCurrentUser,
  notifyGameCancelled,
  removeUnusedGameFiles,
} from "@/shared/server";

export async function deleteGame(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const server = await getCurrentServer();
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
