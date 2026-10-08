import { AddToCalendarButton } from "@/features/add-to-calendar";
import type { GameDetailData } from "@/shared/server";

interface GameCalendarButtonProps {
  game: GameDetailData;
  variant: "outline" | "tinted";
}

export function GameCalendarButton({ game, variant }: GameCalendarButtonProps) {
  if (!game.confirmedAt) return null;
  return (
    <AddToCalendarButton
      gameId={game.id}
      title={game.title}
      rule={game.rule}
      gmNickname={game.gm.username}
      startsAt={game.confirmedAt}
      playMinutes={game.playMinutes}
      variant={variant}
      size="lg"
      className="flex-1"
    />
  );
}
