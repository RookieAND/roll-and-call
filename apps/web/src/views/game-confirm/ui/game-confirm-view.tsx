import { formatPlayMinutes, isAwaitingDraw } from "@roll-and-call/database/games/model";
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
import { ConfirmSessionForm } from "@/features/confirm-session";
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

export async function GameConfirmView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [game, user, availabilities, responseCounts] = await Promise.all([
    getGameById(server.id, id),
    getCurrentSessionUser(),
    getGameAvailabilities({ serverId: server.id, gameId: id }),
    getResponseCounts({ serverId: server.id, gameIds: [id] }),
  ]);
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
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate)
    redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
  if (isSessionStarted(game))
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));

  const appBar = (
    <AppBar
      back={`/games/${id}/manage`}
      title="세션 시간 결정"
      action={<Badge colorPalette="primary">GM</Badge>}
    />
  );

  if (isAwaitingDraw(game)) {
    return (
      <>
        {appBar}
        <Container size="sm" className="py-200">
          <EmptyState
            size="section"
            title="추첨 뒤에 세션 시간을 정할 수 있습니다"
            description="모집 마감 때 추첨이 끝나면 확정자가 가능 시간을 칠합니다."
          />
        </Container>
      </>
    );
  }
  const { rangeStart, rangeEnd } = game;
  if (!rangeStart || !rangeEnd)
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/schedule` }));

  const { names } = aggregateAvailability({ avails: availabilities, userId: null });
  const minutes = effectivePlayMinutes(game.playMinutes);
  const playLabel = formatPlayMinutes(minutes);
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
            playLabel={playLabel}
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
