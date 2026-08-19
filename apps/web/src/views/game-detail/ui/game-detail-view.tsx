import { notFound } from "next/navigation";
import { getGameById } from "@/entities/game/api/queries";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { GameDetail } from "@/widgets/game-detail";

export async function GameDetailView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const user = await getCurrentUser();

  return <GameDetail game={game} viewerId={user?.id ?? null} />;
}
