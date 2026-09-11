import { Container, Text, VStack } from "@trpg/ui";
import { notFound } from "next/navigation";
import { aggregateAvailability, rankSlots } from "@/entities/availability";
import { ConfirmedSessionNotice, hasUserJoined, isGameGm, SCHEDULE_MODE } from "@/entities/game";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { buildDayColumns, buildTimeRows, formatDateTime } from "@/shared/lib";
import {
  getCurrentUser,
  getGameAvailabilities,
  getGameById,
  getUserConfirmedSlots,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { ScheduleBody } from "./schedule-body";

export async function GameScheduleView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const appBar = <AppBar back={`/games/${id}`} title={`${game.title} · 일정 조율`} />;
  const isCoordinated =
    game.scheduleMode === SCHEDULE_MODE.coordinate && game.rangeStart && game.rangeEnd;

  if (!isCoordinated) {
    return (
      <>
        {appBar}
        <Container size="md">
          <VStack gap={4} className="py-6">
            <Text foreground="muted" render={<p />}>
              일시가 지정된 게임이라 조율이 필요 없어요.
            </Text>
          </VStack>
        </Container>
      </>
    );
  }

  const user = await getCurrentUser();
  const viewerId = user?.id ?? null;
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const involved = isGm || hasUserJoined({ participants: game.participants, userId: viewerId });

  const [avails, blocked] = await Promise.all([
    getGameAvailabilities(id),
    user ? getUserConfirmedSlots(user.id, id) : [],
  ]);
  const aggregate = aggregateAvailability({ avails, userId: viewerId });

  const confirmOptions = rankSlots({ counts: aggregate.counts }).map(({ iso, count }) => ({
    iso,
    label: `${formatDateTime(iso)} · ${count}명 가능`,
  }));
  const canConfirm = isGm && !game.confirmedAt;

  return (
    <>
      {appBar}
      <Container>
        <VStack gap={6} className="py-6">
          {game.confirmedAt && <ConfirmedSessionNotice confirmedAt={game.confirmedAt} />}
          <ScheduleBody
            gameId={id}
            days={buildDayColumns(game.rangeStart!, game.rangeEnd!)}
            timeRows={buildTimeRows()}
            aggregate={aggregate}
            blocked={blocked}
            confirmedAt={game.confirmedAt}
            involved={involved}
          />
          {canConfirm && <ConfirmSessionForm gameId={id} options={confirmOptions} />}
        </VStack>
      </Container>
    </>
  );
}
