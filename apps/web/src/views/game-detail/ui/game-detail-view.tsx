import { notFound } from "next/navigation";

import { getCurrentSessionUser, getGameById, getCurrentServer } from "@/shared/server";

import { GameDetail } from "./game-detail";

export async function GameDetailView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();

  return <GameDetail game={game} viewerId={user?.id ?? null} />;
}
