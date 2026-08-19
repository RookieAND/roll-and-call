import { notFound, redirect } from "next/navigation";
import { splitRoster } from "@/entities/game";
import { getGameParticipants } from "@/entities/game/api/queries";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { type ManagedMember, ParticipantManager } from "@/widgets/participant-manager";

export async function ManageParticipantsView({ id }: { id: string }) {
  const data = await getGameParticipants(id);
  if (!data) notFound();
  const { game, availableUserIds } = data;

  const user = await getCurrentUser();
  if (!user || user.id !== game.gmId) redirect(`/games/${id}`);

  const { confirmed, waiting } = splitRoster(game.participants);

  const toMember = (p: (typeof confirmed)[number]): ManagedMember => ({
    userId: p.userId,
    username: p.user?.username ?? "익명",
    avatarUrl: p.user?.avatarUrl ?? null,
    applicationRank: p.applicationRank,
    waitlistRank: p.waitlistRank,
    hasAvailability: availableUserIds.has(p.userId),
  });

  return (
    <ParticipantManager
      gameId={game.id}
      title={game.title}
      endDate={game.endDate.toISOString()}
      confirmedAt={game.confirmedAt ? game.confirmedAt.toISOString() : null}
      maxPlayers={game.maxPlayers}
      confirmed={confirmed.map(toMember)}
      waiting={waiting.map(toMember)}
    />
  );
}
