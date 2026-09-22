import "server-only";
import { notFound, redirect } from "next/navigation";

import { getGameById } from "../db/get-game-by-id";
import { getCurrentUser } from "./get-current-user";

interface RequireGmGameOptions {
  // 로그인 뒤 돌아올 자리.
  next: string;
}

// GM 전용 화면 셋의 입구. 게임 행은 한 번만 읽고, 튕기는 이유마다 갈 곳이 다르다.
// 비로그인·비GM에게 화면 안에서 안내하는 곳(구인 수정 · 참여자 관리)은 이 문을 쓰지 않는다.
export async function requireGmGame(id: string, { next }: RequireGmGameOptions) {
  const [user, game] = await Promise.all([getCurrentUser(), getGameById(id)]);
  if (!game) notFound();
  if (!user) redirect(`/?next=${next}`);
  if (user.id !== game.gmId) redirect(`/games/${id}`);

  return game;
}
