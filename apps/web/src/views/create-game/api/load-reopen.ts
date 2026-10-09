import type { MyRulebooks } from "@/entities/rulebook";
import { canReopenGame, reopenDefaults } from "@/features/reopen-game";
import { getGameById } from "@/shared/server";
import type { ReopenContext } from "@/widgets/game-form";

// 대상이 아니거나 없는 구인이면 안내 없이 빈 위저드(null)로 열고, 읽다가 실패하면 실패 안내만 보인다.
export async function loadReopen({
  serverId,
  userId,
  gameId,
  rulebooks,
}: {
  serverId: string;
  userId: string;
  gameId: string;
  rulebooks: MyRulebooks;
}) {
  try {
    const source = await getGameById(serverId, gameId);
    if (!source || !canReopenGame({ game: source, userId, serverId })) return null;
    const { defaults, ruleNotice } = reopenDefaults({ game: source, rulebooks });
    return { defaults, reopen: { title: source.title, ruleNotice } satisfies ReopenContext };
  } catch {
    return { defaults: undefined, reopen: { failed: true } satisfies ReopenContext };
  }
}
