import Link from "next/link";
import {
  canCoordinateSchedule,
  countConfirmed,
  deriveGameStatus,
  GAME_LIST_CONTEXT,
  GameSummary,
  type GameListContext,
  type ParticipantStatus,
} from "@/entities/game";
import { GameScheduleLink } from "@/features/coordinate-session";
import type { Game } from "@/shared/api/db";

type Props = {
  game: Game & {
    gm: { username: string } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
  context?: GameListContext;
};

// compact row for summary lists (my-page, home dashboard) — no thumbnail.
// entity(GameSummary) 표시 + feature(GameScheduleLink) 동작을 상세 링크로 조합.
export function GameListItem({ game, context = GAME_LIST_CONTEXT.joined }: Props) {
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: countConfirmed(game.participants),
  });
  // GM 확정 전까지는 참여자가 마이페이지에서 바로 조율 플로우로 진입할 수 있게 한다.
  const showSchedule =
    context === GAME_LIST_CONTEXT.joined &&
    canCoordinateSchedule({
      scheduleMode: game.scheduleMode,
      confirmedAt: game.confirmedAt,
      status,
    });

  if (!showSchedule) {
    return (
      <Link href={`/games/${game.id}`} className="block rounded-xl border border-gray-200 p-3.5">
        <GameSummary game={game} context={context} />
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3.5">
      <Link href={`/games/${game.id}`} className="block">
        <GameSummary game={game} context={context} />
      </Link>
      <GameScheduleLink gameId={game.id} className="mt-2.5 h-9 w-full rounded-lg text-xs" />
    </div>
  );
}
