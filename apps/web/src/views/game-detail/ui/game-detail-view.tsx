import { notFound } from "next/navigation";

import { SCHEDULE_MODE } from "@/entities/game";
import { getCurrentUser, getGameById, getRespondedUserIds } from "@/shared/server";

import { GameDetail } from "./game-detail";

export async function GameDetailView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const [user, respondedIds] = await Promise.all([
    getCurrentUser(),
    game.scheduleMode === SCHEDULE_MODE.coordinate ? getRespondedUserIds(id) : Promise.resolve([]),
  ]);

  return <GameDetail game={game} viewerId={user?.id ?? null} respondedIds={respondedIds} />;
}
