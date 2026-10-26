import "server-only";
import { canAccessGame } from "@roll-and-call/database/games/model";
import { cache } from "react";

import { getCurrentSessionUser } from "../auth/get-current-session-user";
import { getGameById } from "./get-game-by-id";

// 끝나기 전의 비공개 구인은 열 수 없는 사람에게 없는 구인과 같게 undefined를 돌려준다. 운영진은 어드민 앱에서 본다.
export const getViewableGame = cache(async (serverId: string, gameId: string) => {
  const [game, user] = await Promise.all([getGameById(serverId, gameId), getCurrentSessionUser()]);
  if (!game) return undefined;
  return canAccessGame({ game, viewerId: user?.id ?? null }) ? game : undefined;
});
