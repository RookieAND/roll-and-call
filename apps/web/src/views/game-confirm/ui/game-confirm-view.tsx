import { Container, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { aggregateAvailability } from "@/entities/availability";
import { countConfirmed, SCHEDULE_MODE } from "@/entities/game";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { buildDayColumns, playMinutes, SLOT_MINUTES } from "@/shared/lib";
import { getGameAvailabilities, requireGmGame } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { ConfirmSummary } from "./confirm-summary";

// 가능 시간을 내는 일(일정 조율)과 시간을 정하는 일은 다른 행동이라 화면을 나눈다.
export async function GameConfirmView({ id }: { id: string }) {
  const [game, availabilities] = await Promise.all([
    requireGmGame(id, { next: `/games/${id}/confirm` }),
    getGameAvailabilities(id),
  ]);
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) redirect(`/games/${id}`);
  if (!game.rangeStart || !game.rangeEnd) redirect(`/games/${id}/schedule`);

  const { names } = aggregateAvailability({ avails: availabilities, userId: null });
  const respondedCount = new Set(Object.values(names).flat()).size;
  const minutes = playMinutes(game.playMinutes);
  const playLabel = game.playTime ?? `${minutes / 60}시간`;

  return (
    <>
      <AppBar back={`/games/${id}/manage`} title="세션 시간 결정" />
      <Container size="sm">
        <VStack gap="250" className="pt-200 pb-200">
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
