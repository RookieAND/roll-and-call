import { Button, Container, IconButton, Text, VStack } from "@trpg/ui";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  ConfirmedSessionNotice,
  hasUserJoined,
  isDeadlinePassed,
  isGameGm,
  SCHEDULE_MODE,
} from "@/entities/game";
import { availabilityPrefill } from "@/entities/profile";
import { ErrorBoundary } from "@/shared/error-boundary";
import { buildDayColumns, buildTimeRows, formatDate } from "@/shared/lib";
import { getCurrentUser, getGameById, getProfile } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

import { getScheduleAvailability } from "../api/load-availability";
import { ScheduleBody } from "./schedule-body";

export async function GameScheduleView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  // 일시 지정 글에는 조율 화면이 없다. 주소로 들어오면 상세로 보낸다.
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) redirect(`/games/${id}`);

  const user = await getCurrentUser();
  const viewerId = user?.id ?? null;
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  // GM도 자기 가능 시간을 내야 하므로 입력 화면은 참여자와 같다. 결정은 운영 관리 안에 둔다.
  const appBar = (
    <AppBar
      back={`/games/${id}`}
      title="일정 조율"
      action={
        isGm && (
          <IconButton asChild aria-label="이 구인 관리">
            <Link href={`/games/${id}/manage`}>
              <MoreVertical size={20} />
            </Link>
          </IconButton>
        )
      }
    />
  );

  if (!game.rangeStart || !game.rangeEnd) {
    if (!isGm) redirect(`/games/${id}`);
    return (
      <>
        {appBar}
        <Container size="sm">
          <div className="py-6">
            <EmptyState
              title="조율 기간을 먼저 정해주세요"
              description="조율 기간이 있어야 참여자가 가능 시간을 낼 수 있습니다."
              action={
                <Button asChild className="h-11 w-full">
                  <Link href={`/games/${id}/edit`}>구인 수정</Link>
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
        <VStack gap={5} className="pt-5 pb-4">
          <div>
            <Text typography="heading3" render={<h1 />} className="block truncate">
              {game.title}
            </Text>
            <Text typography="body4" foreground="hint" render={<p />} className="mt-0.5">
              {formatDate(game.rangeStart)} ~ {formatDate(game.rangeEnd)} 조율
            </Text>
          </div>
          {game.confirmedAt && <ConfirmedSessionNotice confirmedAt={game.confirmedAt} />}
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
              capacity={game.maxPlayers}
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
