import { notFound, redirect } from "next/navigation";
import { splitRoster } from "@/entities/game";
import { getCurrentUser, getGameParticipants } from "@/shared/server";
import { ParticipantManager } from "@/widgets/participant-manager";
import { toManagedMember } from "../model/to-managed-member";

export async function ManageParticipantsView({ id }: { id: string }) {
  const data = await getGameParticipants(id);
  if (!data) notFound();
  const { game, availableUserIds } = data;

  const user = await getCurrentUser();
  if (!user || user.id !== game.gmId) redirect(`/games/${id}`);

  const { confirmed, waiting } = splitRoster(game.participants);
  const toMember = (p: (typeof confirmed)[number]) => toManagedMember(p, availableUserIds);

  return (
    <ParticipantManager
      gameId={game.id}
      title={game.title}
      endDate={game.endDate}
      confirmedAt={game.confirmedAt}
      maxPlayers={game.maxPlayers}
      confirmed={confirmed.map(toMember)}
      waiting={waiting.map(toMember)}
    />
  );
}
