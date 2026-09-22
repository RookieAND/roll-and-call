import { notFound } from "next/navigation";

import { getCurrentUser, getGameById } from "@/shared/server";

import { GameDetail } from "./game-detail";

export async function GameDetailView({ id }: { id: string }) {
  const [game, user] = await Promise.all([getGameById(id), getCurrentUser()]);
  if (!game) notFound();

  return <GameDetail game={game} viewerId={user?.id ?? null} />;
}
