import { notFound } from "next/navigation";
import { SCHEDULE_MODE } from "@/entities/game";
import { getCurrentUser, getGameById, getRespondedUserIds } from "@/shared/server";
import { GameDetail } from "./game-detail";
export async function GameDetailView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  // 조율형만 가능 시간 응답이 있다("응답 n/m", "아직 가능 시간을 내지 않았습니다").
  const [user, respondedIds] = await Promise.all([
    getCurrentUser(),
    game.scheduleMode === SCHEDULE_MODE.coordinate ? getRespondedUserIds(id) : Promise.resolve([]),
  ]);

  return <GameDetail game={game} viewerId={user?.id ?? null} respondedIds={respondedIds} />;
}
