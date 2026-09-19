import { Button, Container } from "@trpg/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isSessionLocked, SCHEDULE_MODE, splitRoster } from "@/entities/game";
import { LoginRequired } from "@/features/auth";
import { getCurrentUser, getGameParticipants } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

import { summarizeRoster } from "../model/roster-summary";
import { toManagedMember } from "../model/to-managed-member";
import { ParticipantManager } from "./participant-manager";

export async function ManageParticipantsView({ id }: { id: string }) {
  const data = await getGameParticipants(id);
  if (!data) notFound();
  const { game, availableUserIds } = data;

  const user = await getCurrentUser();
  // 조용히 튕기지 않는다: 비로그인·비GM에게 그 자리에서 안내한다.
  if (!user || user.id !== game.gmId) {
    return (
      <>
        <AppBar back={`/games/${id}`} title="참여자 관리" />
        <Container size="sm">
          <div className="py-6">
            {user ? (
              <EmptyState
                title="GM만 볼 수 있는 화면입니다"
                description="이 구인글의 참여자 관리는 GM만 열 수 있습니다."
                action={
                  <Button asChild variant="outline" className="h-11 w-full">
                    <Link href={`/games/${id}`}>구인 상세로 돌아가기</Link>
                  </Button>
                }
              />
            ) : (
              <LoginRequired />
            )}
          </div>
        </Container>
      </>
    );
  }

  const roster = splitRoster(game.participants);
  const toMember = (participant: (typeof roster.confirmed)[number]) =>
    toManagedMember(participant, availableUserIds);
  const confirmed = roster.confirmed.map(toMember);
  const waiting = roster.waiting.map(toMember);
  const isCoordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;

  return (
    <ParticipantManager
      gameId={game.id}
      title={game.title}
      confirmedAt={game.confirmedAt}
      maxPlayers={game.maxPlayers}
      confirmed={confirmed}
      waiting={waiting}
      summary={summarizeRoster({
        confirmed,
        waiting,
        maxPlayers: game.maxPlayers,
        endDate: game.endDate,
        recruitMethod: game.recruitMethod,
        drawnAt: game.drawnAt,
        isCoordinate,
      })}
      isCoordinate={isCoordinate}
      locked={isSessionLocked(game)}
    />
  );
}
