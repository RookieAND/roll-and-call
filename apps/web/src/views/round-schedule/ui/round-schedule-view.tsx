import {
  getGameParticipants,
  getGameWithRoster,
  getRoundCoordination,
  listGameRounds,
} from "@roll-and-call/database/games";
import {
  DEFAULT_PLAY_MINUTES,
  defaultCoordinationWindow,
  schedulableRoundNo,
} from "@roll-and-call/database/games/model";
import { Callout, Container, Text, VStack } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { roundSlotLabel } from "@/entities/game";
import { GmOnlyNotice, LoginRequired } from "@/features/auth";
import {
  COORDINATION_PHASE,
  coordinationPhase,
  RoundCoordinationOpenForm,
  RoundCoordinationStatus,
  RoundScheduleForm,
  RoundScheduleModes,
} from "@/features/schedule-round";
import { addDays, serverPath, toKstDateInput, toKstDateTimeInput } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { loadRoundCandidates } from "../api/load-round-candidates";

const DEFAULT_COORDINATION_DAYS = 6;

interface RoundScheduleViewProps {
  id: string;
  round: string;
}

// 다회차 GM이 회차 일정을 정하거나 바꾸는 화면.
export async function RoundScheduleView({ id, round }: RoundScheduleViewProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([
    getGameWithRoster({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!game) notFound();
  const roundsPath = serverPath({ slug: server.slug, path: `/games/${id}/rounds` });
  if (game.roundCount < 2) {
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));
  }
  const appBar = <AppBar back={`/games/${id}/rounds`} title="회차 일정" />;
  if (!user || user.id !== game.gmId) {
    return (
      <PageShell readable appBar={appBar}>
        <Container size="sm" className="desktop:px-0">
          <div className="py-300 desktop:py-0">
            {user ? (
              <GmOnlyNotice gameId={id} signedIn description="회차 일정은 GM만 열 수 있습니다." />
            ) : (
              <LoginRequired />
            )}
          </div>
        </Container>
      </PageShell>
    );
  }

  if (game.finishedAt || game.cancelledAt) redirect(roundsPath);
  const roundNo = Number(round);
  const [rounds, detail, coordination] = await Promise.all([
    listGameRounds({ serverId: server.id, gameId: id }),
    getGameParticipants({ serverId: server.id, gameId: id }),
    getRoundCoordination({ serverId: server.id, gameId: id, roundNo }),
  ]);
  const target = rounds.find((candidate) => candidate.roundNo === roundNo);
  if (!target) notFound();

  const now = new Date();
  const started = Boolean(target.startAt && target.startAt <= now);
  const dated = Boolean(target.startAt && target.plannedEndAt);
  if (
    !dated &&
    (roundNo !== schedulableRoundNo(rounds) || game.roundScheduleKind !== "coordinated")
  ) {
    redirect(roundsPath);
  }

  const heading = (
    <Text typography="heading3" weight="extrabold" render={<h2 />}>
      {roundNo}회차 일정 {dated ? "바꾸기" : "잡기"}
    </Text>
  );
  if (started) {
    return (
      <PageShell readable appBar={appBar}>
        <div className={DESKTOP_CARD_CLASS}>
          <Container size="sm">
            <VStack gap="200" className="py-200">
              {heading}
              <Callout.Root>
                <Callout.Icon />
                <Callout.Description>
                  이미 시작한 회차는 일정을 바꿀 수 없습니다.
                </Callout.Description>
              </Callout.Root>
            </VStack>
          </Container>
        </div>
      </PageShell>
    );
  }

  const nicknames = Object.fromEntries([
    ...(detail?.game.participants ?? []).map((participant) => [
      participant.userId,
      participant.user.username,
    ]),
    ...(detail?.game.gm ? [[detail.game.gm.id, detail.game.gm.username]] : []),
  ]);
  const laterRounds = rounds.flatMap((candidate) =>
    candidate.roundNo > roundNo && candidate.startAt
      ? [{ roundNo: candidate.roundNo, startsAt: candidate.startAt.toISOString() }]
      : [],
  );
  const currentSpan =
    target.startAt && target.plannedEndAt
      ? roundSlotLabel({ startsAt: target.startAt, endsAt: target.plannedEndAt })
      : null;
  const playMinutes = game.playMinutes ?? DEFAULT_PLAY_MINUTES;

  const today = toKstDateInput(now);
  const phase = coordinationPhase({
    status: coordination?.status ?? null,
    end: coordination?.end ?? null,
    today,
  });
  const hasCollected =
    coordination !== null &&
    (coordination.status === "coordinating" || coordination.availabilities.length > 0);
  const candidates =
    coordination && hasCollected
      ? await loadRoundCandidates({
          serverId: server.id,
          gameId: id,
          gmId: game.gmId,
          roundNo,
          playMinutes,
          now,
          availabilities: coordination.availabilities,
          totalCount: coordination.totalCount,
          nicknames,
        })
      : [];
  const defaultWindow = defaultCoordinationWindow({ rounds: rounds, game });
  const gridPath =
    roundNo === 1 ? `/games/${id}/schedule` : `/games/${id}/schedule?round=${roundNo}`;

  const form = (
    <RoundScheduleForm
      gameId={id}
      roundNo={roundNo}
      mode={dated ? "move" : "set"}
      initialStartsAt={target.startAt ? toKstDateTimeInput(target.startAt) : ""}
      initialEndsAt={target.plannedEndAt ? toKstDateTimeInput(target.plannedEndAt) : ""}
      defaultMinutes={playMinutes}
      designated={game.roundScheduleKind === "designated"}
      laterRounds={laterRounds}
      candidates={candidates}
      nicknames={nicknames}
    />
  );
  const collecting =
    coordination && phase !== COORDINATION_PHASE.idle && coordination.end ? (
      <RoundCoordinationStatus
        gameId={id}
        roundNo={roundNo}
        phase={phase}
        end={coordination.end}
        today={today}
        respondedCount={coordination.respondedCount}
        totalCount={coordination.totalCount}
        pendingNames={coordination.pendingNames}
        gridPath={gridPath}
      />
    ) : (
      <RoundCoordinationOpenForm
        gameId={id}
        roundNo={roundNo}
        rescheduling={dated}
        today={today}
        defaultStart={today}
        defaultEnd={addDays({ date: today, count: DEFAULT_COORDINATION_DAYS })}
        defaultStartHour={defaultWindow.startHour}
        defaultEndHour={defaultWindow.endHour}
      />
    );

  return (
    <PageShell readable appBar={appBar}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="200" className="py-200">
            {heading}
            {currentSpan && (
              <Text typography="body3" foreground="muted">
                지금은 {currentSpan}입니다.
              </Text>
            )}
            <RoundScheduleModes
              directLabel={dated ? "옮기기" : "바로 정하기"}
              coordinateLabel={dated ? "다시 조율" : "가능 시간 모으기"}
              direct={form}
              coordinate={collecting}
            />
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
