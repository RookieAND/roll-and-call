import { notFound } from "next/navigation";
import { Container, Text, VStack } from "@trpg/ui";
import {
  getGameAvailabilities,
  getGameById,
  getUserConfirmedSlots,
} from "@/entities/game/index.server";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { AvailabilityGrid } from "@/features/coordinate-session";
import {
  aggregateAvailability,
  ConfirmedSessionNotice,
  hasUserJoined,
  isGameGm,
  rankSlots,
  SCHEDULE_MODE,
} from "@/entities/game";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { formatDateTime } from "@/shared/lib/format";
import { buildDayColumns, buildTimeRows } from "@/shared/lib/slots";
import { AppBar } from "@/shared/ui/app-bar";
import { StatusNotice } from "@/shared/ui/status-notice";
import { HeatLegend, Heatmap } from "./heatmap";
import { ScheduleOverlapEmpty } from "./schedule-overlap-empty";
import { ScheduleTabs } from "./schedule-tabs";

export async function GameScheduleView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  if (game.scheduleMode !== SCHEDULE_MODE.coordinate || !game.rangeStart || !game.rangeEnd) {
    return (
      <>
        <AppBar back={`/games/${id}`} title={`${game.title} · 일정 조율`} />
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

  const isGm = isGameGm({ gmId: game.gmId, userId: user?.id ?? null });
  const involved =
    isGm || hasUserJoined({ participants: game.participants, userId: user?.id ?? null });

  const days = buildDayColumns(game.rangeStart, game.rangeEnd);
  const timeRows = buildTimeRows();

  const avails = await getGameAvailabilities(id);
  const hasResponses = avails.length > 0;
  const { counts, names, mine } = aggregateAvailability({
    avails,
    userId: user?.id ?? null,
  });

  const blocked = user ? await getUserConfirmedSlots(user.id, id) : [];

  const confirmOptions = rankSlots({ counts }).map(({ iso, count }) => ({
    iso,
    label: `${formatDateTime(iso)} · ${count}명 가능`,
  }));

  const overlapBlock = (hint: string) => (
    <VStack gap={3}>
      <Text typography="body4" foreground="muted">
        {hint}
      </Text>
      <HeatLegend />
      <Heatmap
        days={days}
        timeRows={timeRows}
        counts={counts}
        names={names}
        confirmedAt={game.confirmedAt}
      />
    </VStack>
  );

  return (
    <>
      <AppBar back={`/games/${id}`} title={`${game.title} · 일정 조율`} />
      <Container>
        <VStack gap={6} className="py-6">
          {game.confirmedAt && <ConfirmedSessionNotice confirmedAt={game.confirmedAt} />}

          {game.confirmedAt ? (
            overlapBlock("확정된 슬롯은 초록 테두리로 표시됩니다. 편집은 잠깁니다.")
          ) : involved ? (
            <ScheduleTabs
              mine={
                <AvailabilityGrid
                  gameId={id}
                  days={days}
                  timeRows={timeRows}
                  initialMine={mine}
                  blocked={blocked}
                />
              }
              overlap={
                hasResponses ? (
                  overlapBlock(
                    "색이 진할수록 많은 인원이 가능합니다. 셀에 커서를 올리면 이름이 보입니다.",
                  )
                ) : (
                  <ScheduleOverlapEmpty />
                )
              }
            />
          ) : (
            <VStack gap={3}>
              {hasResponses ? (
                overlapBlock("전체 겹침만 열람할 수 있습니다.")
              ) : (
                <ScheduleOverlapEmpty />
              )}
              <StatusNotice tone="muted">참여자만 가능 시간을 입력할 수 있습니다.</StatusNotice>
            </VStack>
          )}

          {isGm && !game.confirmedAt && <ConfirmSessionForm gameId={id} options={confirmOptions} />}
        </VStack>
      </Container>
    </>
  );
}
