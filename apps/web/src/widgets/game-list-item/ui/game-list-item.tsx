import Link from "next/link";
import {
  canCoordinateSchedule,
  countConfirmed,
  deriveGameStatus,
  GameSummary,
  type ParticipantStatus,
  type SessionRole,
} from "@/entities/game";
import { GameScheduleLink } from "@/features/coordinate-session";
import type { Game } from "@/shared/server";
import { gameSubline } from "../model/game-subline";

type Props = {
  game: Game & {
    gm: { username: string } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
  // 뷰어가 이 게임의 GM인지 참여자인지. 서브라인 문구와 조율 링크 노출을 가른다.
  role?: SessionRole;
};

// 썸네일 없는 요약 행(마이페이지·홈 대시보드).
// entity(GameSummary) 표시 + feature(GameScheduleLink) 동작을 상세 링크로 조합한다.
export function GameListItem({ game, role = "player" }: Props) {
  const confirmedCount = countConfirmed(game.participants);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmedCount,
  });
  const subline = gameSubline({ game, role, status, confirmedCount });

  // GM 확정 전까지는 참여자가 마이페이지에서 바로 조율 플로우로 진입할 수 있게 한다.
  const showSchedule =
    role === "player" &&
    canCoordinateSchedule({
      scheduleMode: game.scheduleMode,
      confirmedAt: game.confirmedAt,
      status,
    });

  const summaryLink = (
    <Link href={`/games/${game.id}`} className="block">
      <GameSummary game={game} status={status} subline={subline} />
    </Link>
  );

  if (!showSchedule) {
    return <div className="rounded-xl border border-gray-200 p-3.5">{summaryLink}</div>;
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3.5">
      {summaryLink}
      <GameScheduleLink gameId={game.id} className="mt-2.5 h-9 w-full rounded-lg text-xs" />
    </div>
  );
}
