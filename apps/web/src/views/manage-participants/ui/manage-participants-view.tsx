import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { isSessionEnded, isSessionStarted, SCHEDULE_MODE, splitRoster } from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { nextRoundBaseDate } from "@/features/open-next-round";
import { serverPath } from "@/shared/lib";
import {
  getApplicationNotes,
  getCurrentSessionUser,
  getGameParticipants,
  getCurrentServer,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { summarizeRoster } from "../model/roster-summary";
import { toManagedMember } from "../model/to-managed-member";
import { ParticipantManager } from "./participant-manager";

interface ManageParticipantsViewProps {
  id: string;
}

export async function ManageParticipantsView({ id }: ManageParticipantsViewProps) {
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
  if (game.cancelledAt || isSessionEnded(game)) {
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));
  }

  // 신청글은 GM 확인을 거친 뒤에만 읽는다.
  const applicationNotes = new Map(
    (await getApplicationNotes({ serverId: server.id, gameId: id, gmId: user.id })).map(
      ({ userId, note }) => [userId, note],
    ),
  );
  const roster = splitRoster(game.participants);
  const toMember = (participant: (typeof roster.confirmed)[number]) =>
    toManagedMember({
      participant,
      availableUserIds,
      applicationNote: applicationNotes.get(participant.userId) ?? null,
    });
  const confirmed = roster.confirmed.map(toMember);
  const waiting = roster.waiting.map(toMember);
  const confirmedRows = [...roster.confirmed, ...roster.removed]
    .toSorted((left, right) => left.applicationRank - right.applicationRank)
    .map(toMember);
  const isCoordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  const summary = summarizeRoster({
    confirmed,
    waiting,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    endDate: game.endDate,
    recruitMethod: game.recruitMethod,
    drawnAt: game.drawnAt,
    hasRolls: game.participants.some((participant) => !isNull(participant.drawRoll)),
    isCoordinate,
    started: isSessionStarted(game),
    capacityRaised: !isNull(game.capacityRaisedAt),
  });

  return (
    <ParticipantManager
      game={{
        id: game.id,
        title: game.title,
        maxPlayers: game.maxPlayers,
        scheduleMode: game.scheduleMode,
      }}
      confirmedRows={confirmedRows}
      confirmedCount={confirmed.length}
      waiting={waiting}
      summary={summary}
      isCoordinate={isCoordinate}
      nextRoundBaseDate={nextRoundBaseDate({
        confirmedAt: game.confirmedAt,
        rangeEnd: game.rangeEnd,
      })}
    />
  );
}
