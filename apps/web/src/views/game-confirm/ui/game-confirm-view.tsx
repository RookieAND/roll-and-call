import { Container, VStack } from "@trpg/ui";
import { notFound, redirect } from "next/navigation";

import { aggregateAvailability } from "@/entities/availability";
import { countConfirmed, isGameGm, SCHEDULE_MODE } from "@/entities/game";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { buildDayColumns, SLOT_MINUTES } from "@/shared/lib";
import { getCurrentUser, getGameAvailabilities, getGameById, playMinutes } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { ConfirmSummary } from "./confirm-summary";

// 가능 시간을 내는 일(일정 조율)과 시간을 정하는 일은 다른 행동이라 화면을 나눈다.
export async function GameConfirmView({ id }: { id: string }) {
  const [user, game] = await Promise.all([getCurrentUser(), getGameById(id)]);
  if (!game) notFound();
  if (!user) redirect(`/?next=/games/${id}/confirm`);
  if (!isGameGm({ gmId: game.gmId, userId: user.id })) redirect(`/games/${id}`);
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) redirect(`/games/${id}`);
  if (!game.rangeStart || !game.rangeEnd) redirect(`/games/${id}/schedule`);

  const availabilities = await getGameAvailabilities(id);
  const { names } = aggregateAvailability({ avails: availabilities, userId: null });
  const respondedCount = new Set(Object.values(names).flat()).size;
  const minutes = playMinutes(game.playTime);
  const playLabel = game.playTime ?? `${minutes / 60}시간`;

  return (
    <>
      <AppBar back={`/games/${id}/manage`} title="세션 시간 결정" />
      <Container size="sm">
        <VStack gap={5} className="pt-4 pb-4">
          <ConfirmSummary playLabel={playLabel} respondedCount={respondedCount} />
          <ConfirmSessionForm
            gameId={id}
            days={buildDayColumns(game.rangeStart, game.rangeEnd)}
            rangeStart={game.rangeStart}
            names={names}
            playMinutes={minutes}
            playLabel={playLabel}
            slotCount={Math.ceil(minutes / SLOT_MINUTES)}
            confirmedCount={countConfirmed(game.participants)}
            currentIso={game.confirmedAt?.toISOString() ?? null}
          />
        </VStack>
      </Container>
    </>
  );
}
