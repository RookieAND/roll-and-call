import {
  AWAITING_RESULT_PHRASE,
  awaitingResultMethod,
  formatPlayMinutes,
  formatPlayRange,
} from "@roll-and-call/database/games/model";
import { Badge, Container, VStack } from "@roll-and-call/ui";
import { pick } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { aggregateAvailability } from "@/entities/availability";
import {
  countConfirmed,
  effectivePlayMinutes,
  isSessionStarted,
  SCHEDULE_MODE,
} from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { ConfirmSessionForm, FixedSessionChangeForm } from "@/features/confirm-session";
import { formatDate, serverPath } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getGameAvailabilities,
  getGameById,
  getCurrentServer,
  getResponseCounts,
} from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

import { ConfirmSummary } from "./confirm-summary";

interface GameConfirmViewProps {
  id: string;
}

export async function GameConfirmView({ id }: GameConfirmViewProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();
  if (user?.id !== game.gmId) {
    return (
      <>
        <AppBar back={`/games/${id}`} title="세션 시간 결정" />
        <Container size="sm" className="py-300">
          <GmOnlyNotice
            gameId={id}
            signedIn={!!user}
            description="이 구인글의 세션 시간은 GM만 정할 수 있습니다."
          />
        </Container>
      </>
    );
  }
  if (isSessionStarted(game))
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));
  if (game.scheduleMode === SCHEDULE_MODE.fixed) {
    if (!game.confirmedAt || game.cancelledAt)
      redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
    return (
      <>
        <AppBar
          back={`/games/${id}/manage`}
          title="세션 시간 바꾸기"
          action={<Badge colorPalette="primary">GM</Badge>}
        />
        <Container size="sm">
          <VStack gap="200" className="pt-200 pb-200">
            <FixedSessionChangeForm
              gameId={id}
              endDate={game.endDate}
              confirmedAt={game.confirmedAt}
              confirmedCount={countConfirmed(game.participants)}
              playMinutes={effectivePlayMinutes(game.playMinutes)}
            />
          </VStack>
        </Container>
      </>
    );
  }

  const appBar = (
    <AppBar
      back={`/games/${id}/manage`}
      title="세션 시간 결정"
      action={<Badge colorPalette="primary">GM</Badge>}
    />
  );

  const awaitingResult = awaitingResultMethod(game);
  if (awaitingResult) {
    const isLottery = awaitingResult === "lottery";
    return (
      <>
        {appBar}
        <Container size="sm" className="py-200">
          <EmptyState
            size="section"
            title={`${AWAITING_RESULT_PHRASE[awaitingResult]} 세션 시간을 정할 수 있습니다`}
            description={
              isLottery
                ? "모집 마감 때 추첨이 끝나면 확정자가 가능 시간을 칠합니다."
                : "GM이 선발을 마치면 확정자가 가능 시간을 칠합니다."
            }
          />
        </Container>
      </>
    );
  }
  const [availabilities, responseCounts] = await Promise.all([
    getGameAvailabilities({ serverId: server.id, gameId: id }),
    getResponseCounts({ serverId: server.id, gameIds: [id] }),
  ]);
  const { rangeStart, rangeEnd } = game;
  if (!rangeStart || !rangeEnd)
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/schedule` }));

  const { names } = aggregateAvailability({ avails: availabilities, userId: null });
  const minutes = effectivePlayMinutes(game.playMinutes);
  const playLabel = formatPlayMinutes(minutes);
  const playRangeLabel = formatPlayRange(game.playMinutesMin, game.playMinutes) ?? playLabel;
  const confirmedCount = countConfirmed(game.participants);

  return (
    <>
      {appBar}
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-200">
          <ConfirmSummary
            title={game.title}
            rule={game.rule}
            respondedCount={responseCounts.get(id) ?? 0}
            confirmedCount={confirmedCount}
            playLabel={playRangeLabel}
            deadlineLabel={formatDate(game.endDate)}
          />
          <ConfirmSessionForm
            game={{
              ...pick(game, [
                "id",
                "windowStartHour",
                "windowEndHour",
                "maxPlayers",
                "confirmedAt",
              ]),
              rangeStart,
              rangeEnd,
              playMinutes: minutes,
              confirmedCount,
            }}
            names={names}
            playLabel={playLabel}
          />
        </VStack>
      </Container>
    </>
  );
}
