import { Container } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import {
  isAttendanceDue,
  isSessionLocked,
  SCHEDULE_MODE,
  isSessionEnded,
  splitRoster,
} from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { getCurrentUser, getGameParticipants } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { ATTENDANCE_STAGE } from "../model/attendance-stage";
import { summarizeRoster } from "../model/roster-summary";
import { toManagedMember } from "../model/to-managed-member";
import { ParticipantManager } from "./participant-manager";

export async function ManageParticipantsView({ id }: { id: string }) {
  const [data, user] = await Promise.all([getGameParticipants(id), getCurrentUser()]);
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
    toManagedMember(participant, availableUserIds);
  const confirmed = roster.confirmed.map(toMember);
  const waiting = roster.waiting.map(toMember);
  const isCoordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  const attendanceStage = isAttendanceDue(game, confirmed.length)
    ? ATTENDANCE_STAGE.due
    : game.attendanceConfirmedAt && isSessionEnded(game)
      ? ATTENDANCE_STAGE.done
      : null;

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
