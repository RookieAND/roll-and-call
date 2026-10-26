import { getGameAvailabilities, getResponseCounts } from "@roll-and-call/database/games";
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
import { getCurrentSessionUser, getViewableGame, getCurrentServer } from "@/shared/server";
import { AppBar, EmptyState, PageShell } from "@/shared/ui";

import { ConfirmPanelStats } from "./confirm-panel-stats";
import { ConfirmSummary } from "./confirm-summary";

interface GameConfirmViewProps {
  id: string;
}

export async function GameConfirmView({ id }: GameConfirmViewProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getViewableGame(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();
  if (user?.id !== game.gmId) {
    return (
      <PageShell readable appBar={<AppBar back={`/games/${id}`} title="세션 시간 결정" />}>
        <Container size="sm" className="py-300 desktop:px-0 desktop:py-0">
          <GmOnlyNotice
            gameId={id}
            signedIn={!!user}
            description="이 구인글의 세션 시간은 GM만 정할 수 있습니다."
          />
        </Container>
      </PageShell>
    );
  }
  if (isSessionStarted(game))
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));
  if (game.scheduleMode === SCHEDULE_MODE.fixed) {
    if (!game.confirmedAt || game.cancelledAt)
      redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
    return (
      <PageShell
        readable
        appBar={
          <AppBar
            back={`/games/${id}/manage`}
            title="세션 시간 바꾸기"
            action={<Badge colorPalette="primary">GM</Badge>}
          />
        }
      >
        <Container size="sm" className="desktop:px-0">
          <VStack gap="200" className="pt-200 pb-200 desktop:pt-0 desktop:pb-0">
            <FixedSessionChangeForm
              gameId={id}
              endDate={game.endDate}
              confirmedAt={game.confirmedAt}
              confirmedCount={countConfirmed(game.participants)}
              playMinutes={effectivePlayMinutes(game.playMinutes)}
            />
          </VStack>
        </Container>
      </PageShell>
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
      <PageShell readable appBar={appBar}>
        <Container size="sm" className="py-200 desktop:px-0 desktop:py-0">
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
      </PageShell>
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
  const respondedCount = responseCounts.get(id) ?? 0;

  return (
    <ConfirmSessionForm
      game={{
        ...pick(game, ["id", "windowStartHour", "windowEndHour", "maxPlayers", "confirmedAt"]),
        rangeStart,
        rangeEnd,
        playMinutes: minutes,
        confirmedCount,
      }}
      names={names}
      playLabel={playLabel}
      appBar={appBar}
      summary={
        <ConfirmSummary
          title={game.title}
          rule={game.rule}
          respondedCount={respondedCount}
          confirmedCount={confirmedCount}
          playLabel={playRangeLabel}
          deadlineLabel={formatDate(game.endDate)}
        />
      }
      panelStats={
        <ConfirmPanelStats
          playLabel={playRangeLabel}
          respondedCount={respondedCount}
          confirmedCount={confirmedCount}
        />
      }
    />
  );
}
