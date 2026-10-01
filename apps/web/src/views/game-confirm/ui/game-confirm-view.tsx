import { Badge, Container, VStack } from "@roll-and-call/ui";
import { uniq } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { aggregateAvailability } from "@/entities/availability";
import { countConfirmed, SCHEDULE_MODE } from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { buildDayColumns, playMinutes, SLOT_MINUTES, serverPath } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getGameAvailabilities,
  getGameById,
  getCurrentServer,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { ConfirmSummary } from "./confirm-summary";

export async function GameConfirmView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [game, user, availabilities] = await Promise.all([
    getGameById(server.id, id),
    getCurrentSessionUser(),
    getGameAvailabilities({ serverId: server.id, gameId: id }),
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
  if (!game.rangeStart || !game.rangeEnd)
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/schedule` }));

  const { names } = aggregateAvailability({ avails: availabilities, userId: null });
  const respondedCount = uniq(Object.values(names).flat()).length;
  const minutes = playMinutes(game.playMinutes);
  const playLabel = game.playTime ?? `${minutes / 60}시간`;

  return (
    <>
      <AppBar
        back={`/games/${id}/manage`}
        title="세션 시간 결정"
        action={<Badge colorPalette="primary">GM</Badge>}
      />
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-200">
          <ConfirmSummary playLabel={playLabel} respondedCount={respondedCount} />
          <ConfirmSessionForm
            gameId={id}
            days={buildDayColumns({ rangeStart: game.rangeStart, rangeEnd: game.rangeEnd })}
            rangeStart={game.rangeStart}
            names={names}
            playMinutes={minutes}
            playLabel={playLabel}
            slotCount={Math.ceil(minutes / SLOT_MINUTES)}
            confirmedCount={countConfirmed(game.participants)}
            maxPlayers={game.maxPlayers}
            currentIso={game.confirmedAt?.toISOString() ?? null}
          />
        </VStack>
      </Container>
    </>
  );
}
