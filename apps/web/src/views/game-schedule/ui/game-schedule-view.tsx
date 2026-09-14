import { Container, Text, VStack } from "@trpg/ui";
import { notFound } from "next/navigation";
import { ConfirmedSessionNotice, hasUserJoined, isGameGm, SCHEDULE_MODE } from "@/entities/game";
import { buildDayColumns, buildTimeRows } from "@/shared/lib";
import { getCurrentUser, getGameById } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { getScheduleAvailability } from "../api/load-availability";
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

  // 첫 렌더 값만 서버가 채운다. 이후 갱신은 ScheduleBody의 쿼리 캐시가 맡는다.
  const initialAvailability = await getScheduleAvailability(id, viewerId);

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
            initialAvailability={initialAvailability}
            confirmedAt={game.confirmedAt}
            involved={involved}
            isGm={isGm}
          />
        </VStack>
      </Container>
    </>
  );
}
