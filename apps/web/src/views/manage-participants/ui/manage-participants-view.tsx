import { Container } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { isSessionLocked, SCHEDULE_MODE, splitRoster } from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { getCurrentSessionUser, getGameParticipants, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { summarizeRoster } from "../model/roster-summary";
import { toManagedMember } from "../model/to-managed-member";
import { attendanceStageOf } from "./attendance-stage-of";
import { ParticipantManager } from "./participant-manager";

export async function ManageParticipantsView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [data, user] = await Promise.all([
    getGameParticipants({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!data) notFound();
  const { game, availableUserIds } = data;

  if (!user || user.id !== game.gmId) {
    return (
      <>
        <AppBar back={`/games/${id}`} title="참여자 관리" />
        <Container size="sm">
          <div className="py-300">
            <GmOnlyNotice
              gameId={id}
              signedIn={!!user}
              description="이 구인글의 참여자 관리는 GM만 열 수 있습니다."
            />
          </div>
        </Container>
      </>
    );
  }

  const roster = splitRoster(game.participants);
  const toMember = (participant: (typeof roster.confirmed)[number]) =>
    toManagedMember({ participant, availableUserIds });
  const confirmed = roster.confirmed.map(toMember);
  const waiting = roster.waiting.map(toMember);
  const isCoordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  const attendanceStage = attendanceStageOf({ game, confirmedCount: confirmed.length });

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
        rolled: game.participants.some((participant) => participant.drawRoll !== null),
        isCoordinate,
      })}
      isCoordinate={isCoordinate}
      locked={isSessionLocked(game)}
      attendanceStage={attendanceStage}
    />
  );
}
