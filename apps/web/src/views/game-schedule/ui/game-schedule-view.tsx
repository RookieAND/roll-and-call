import { isAwaitingDraw } from "@roll-and-call/database/games/model";
import { Badge, Button, Container, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  coordinationWindowOf,
  countConfirmed,
  isDeadlinePassed,
  isGameGm,
  PARTICIPANT_STATUS,
  SCHEDULE_MODE,
} from "@/entities/game";
import { ErrorBoundary } from "@/shared/error-boundary";
import { buildDayColumns, buildTimeRows, serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getGameById, getCurrentServer } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

import { getScheduleAvailability } from "../api/load-availability";
import { scheduleBodyModeOf } from "../model/schedule-body-mode-of";
import { ScheduleBody } from "./schedule-body";

export async function GameScheduleView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();

  if (game.scheduleMode !== SCHEDULE_MODE.coordinate)
    redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));

  const viewerId = user?.id ?? null;
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const appBar = (
    <AppBar
      back={`/games/${id}`}
      title="일정 조율"
      subtitle={game.title}
      action={isGm && <Badge colorPalette="primary">GM</Badge>}
    />
  );

  if (!game.rangeStart || !game.rangeEnd) {
    if (!isGm) redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
    return (
      <>
        {appBar}
        <Container size="sm">
          <div className="py-300">
            <EmptyState
              title="조율 기간을 먼저 정해 주세요"
              description="조율 기간이 있어야 참여자가 가능 시간을 낼 수 있습니다."
              action={
                <Button
                  render={
                    <Link href={serverPath({ slug: server.slug, path: `/games/${id}/edit` })} />
                  }
                  className="mt-100 w-full"
                >
                  구인 수정
                </Button>
              }
            />
          </div>
        </Container>
      </>
    );
  }

  const canPaint =
    isGm ||
    game.participants.some(
      (participant) =>
        participant.userId === viewerId && participant.status === PARTICIPANT_STATUS.confirmed,
    );
  const deadlinePassed = isDeadlinePassed(game.endDate);
  const mode = scheduleBodyModeOf({
    confirmedAt: game.confirmedAt,
    canPaint,
    awaitingDraw: isAwaitingDraw(game),
    unscheduled: deadlinePassed && countConfirmed(game.participants) === 0,
    isGm,
    isSignedIn: !isNull(viewerId),
    deadlinePassed,
  });
  const days = buildDayColumns({ rangeStart: game.rangeStart, rangeEnd: game.rangeEnd });
  const timeRows = buildTimeRows(coordinationWindowOf(game));

  const initialAvailability = await getScheduleAvailability({ gameId: id, userId: viewerId });

  return (
    <>
      {appBar}
      <Container>
        <VStack className="pt-175 pb-200">
          <ErrorBoundary>
            <ScheduleBody
              gameId={id}
              days={days}
              timeRows={timeRows}
              initialAvailability={initialAvailability}
              mode={mode}
              // GM도 가능 시간을 내므로 겹침 단계는 정원 + GM 기준으로 나눈다.
              capacity={game.maxPlayers + 1}
              gmName={game.gm?.username}
            />
          </ErrorBoundary>
        </VStack>
      </Container>
    </>
  );
}
