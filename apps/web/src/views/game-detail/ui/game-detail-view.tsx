import { notFound } from "next/navigation";

import { getCurrentSessionUser, getGameById } from "@/shared/server";

import { GameDetail } from "./game-detail";

export async function GameDetailView({ id }: { id: string }) {
  const [game, user] = await Promise.all([getGameById(id), getCurrentSessionUser()]);
  if (!game) notFound();

  return <GameDetail game={game} viewerId={user?.id ?? null} />;
}
