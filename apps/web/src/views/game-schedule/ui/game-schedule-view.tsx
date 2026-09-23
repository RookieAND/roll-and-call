import { Badge, Button, Container, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { hasUserJoined, isDeadlinePassed, isGameGm, SCHEDULE_MODE } from "@/entities/game";
import { availabilityPrefill } from "@/entities/profile";
import { ErrorBoundary } from "@/shared/error-boundary";
import { buildDayColumns, buildTimeRows } from "@/shared/lib";
import { getCurrentUser, getGameById, getProfile } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

import { getScheduleAvailability } from "../api/load-availability";
import { ScheduleBody } from "./schedule-body";

export async function GameScheduleView({ id }: { id: string }) {
  const [game, user] = await Promise.all([getGameById(id), getCurrentUser()]);
  if (!game) notFound();

  // 일시 지정 글에는 조율 화면이 없다. 주소로 들어오면 상세로 보낸다.
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) redirect(`/games/${id}`);

  const viewerId = user?.id ?? null;
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  // GM도 자기 가능 시간을 내야 하므로 입력 화면은 참여자와 같다. 결정은 운영 관리 안에 둔다.
  const appBar = (
    <AppBar
      back={`/games/${id}`}
      title="일정 조율"
      subtitle={game.title}
      action={isGm && <Badge colorPalette="primary">GM</Badge>}
    />
  );

  if (!game.rangeStart || !game.rangeEnd) {
    if (!isGm) redirect(`/games/${id}`);
    return (
      <>
        {appBar}
        <Container size="sm">
          <div className="py-300">
            <EmptyState
              title="조율 기간을 먼저 정해주세요"
              description="조율 기간이 있어야 참여자가 가능 시간을 낼 수 있습니다."
              action={
                <Button render={<Link href={`/games/${id}/edit`} />} className="mt-100 w-full">
                  구인 수정
                </Button>
              }
            />
          </div>
        </Container>
      </>
    );
  }

  const involved = isGm || hasUserJoined({ participants: game.participants, userId: viewerId });
  const days = buildDayColumns(game.rangeStart, game.rangeEnd);
  const timeRows = buildTimeRows();

  const [initialAvailability, profile] = await Promise.all([
    getScheduleAvailability(id, viewerId),
    involved && viewerId && !game.confirmedAt ? getProfile(viewerId) : null,
  ]);
  const prefill = profile ? availabilityPrefill(profile.availability, days, timeRows) : null;

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
              confirmedAt={game.confirmedAt}
              involved={involved}
              isGm={isGm}
              isSignedIn={viewerId !== null}
              // GM도 가능 시간을 내므로 겹침 단계는 정원 + GM 기준으로 나눈다.
              capacity={game.maxPlayers + 1}
              gmName={game.gm?.username}
              prefill={prefill}
              deadlinePassed={isDeadlinePassed(game.endDate)}
            />
          </ErrorBoundary>
        </VStack>
      </Container>
    </>
  );
}
