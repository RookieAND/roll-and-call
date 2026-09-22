import { notFound } from "next/navigation";

import { getCurrentUser, getGameById } from "@/shared/server";

import { GameDetail } from "./game-detail";

export async function GameDetailView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const user = await getCurrentUser();

  return <GameDetail game={game} viewerId={user?.id ?? null} />;
}
