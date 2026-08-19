import { notFound } from "next/navigation";
import { Container, Text, VStack } from "@trpg/ui";
import {
  getGameAvailabilities,
  getGameById,
  getUserConfirmedSlots,
} from "@/entities/game/api/queries";
import {
  AvailabilityGrid,
  ConfirmSessionForm,
  HeatLegend,
  Heatmap,
} from "@/features/session";
import {
  aggregateAvailability,
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
import { ScheduleTabs } from "./schedule-tabs";

export async function GameScheduleView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  if (
    game.scheduleMode !== SCHEDULE_MODE.coordinate ||
    !game.rangeStart ||
    !game.rangeEnd
  ) {
    return (
      <>
        <AppBar back={`/games/${id}`} title={`${game.title} · 일정 조율`} />
        <Container size="md">
          <VStack gap={4} className="py-6">
            <p className="text-gray-500">
              일시가 지정된 게임이라 조율이 필요 없어요.
            </p>
          </VStack>
        </Container>
      </>
    );
  }

  const user = await getCurrentUser();

  const isGm = isGameGm({ gmId: game.gmId, userId: user?.id ?? null });
  const involved =
    isGm ||
    hasUserJoined({ participants: game.participants, userId: user?.id ?? null });

  const days = buildDayColumns(game.rangeStart, game.rangeEnd);
  const timeRows = buildTimeRows();

  const avails = await getGameAvailabilities(id);
  const { counts, names, mine } = aggregateAvailability({
    avails,
    userId: user?.id ?? null,
  });

  const blocked = user ? await getUserConfirmedSlots(user.id, id) : [];

  const confirmedIso = game.confirmedAt ? game.confirmedAt.toISOString() : null;

  const confirmOptions = rankSlots({ counts }).map(({ iso, count }) => ({
    iso,
    label: `${formatDateTime(iso)} · ${count}명 가능`,
  }));

  const overlapBlock = (hint: string) => (
    <VStack gap={3}>
      <Text size="xs" color="muted">
        {hint}
      </Text>
      <HeatLegend />
      <Heatmap
        days={days}
        timeRows={timeRows}
        counts={counts}
        names={names}
        confirmedIso={confirmedIso}
      />
    </VStack>
  );

  return (
    <>
      <AppBar back={`/games/${id}`} title={`${game.title} · 일정 조율`} />
      <Container>
        <VStack gap={6} className="py-6">
          {game.confirmedAt && (
            <div className="flex items-center gap-2 rounded-[14px] border border-success-200 bg-success-50 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-success-600" />
              <div>
                <div className="text-xs font-bold text-success-700">
                  세션 확정
                </div>
                <div className="text-[15px] font-extrabold text-success-800">
                  {formatDateTime(game.confirmedAt)}
                </div>
              </div>
            </div>
          )}

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
              overlap={overlapBlock(
                "색이 진할수록 많은 인원이 가능합니다. 셀에 커서를 올리면 이름이 보입니다.",
              )}
            />
          ) : (
            <VStack gap={3}>
              {overlapBlock("전체 겹침만 열람할 수 있습니다.")}
              <StatusNotice tone="muted">
                참여자만 가능 시간을 입력할 수 있습니다.
              </StatusNotice>
            </VStack>
          )}

          {isGm && !game.confirmedAt && (
            <ConfirmSessionForm gameId={id} options={confirmOptions} />
          )}
        </VStack>
      </Container>
    </>
  );
}
