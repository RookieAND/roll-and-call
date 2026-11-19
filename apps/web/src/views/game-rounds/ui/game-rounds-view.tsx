import {
  getGameWithRoster,
  getRoundCoordination,
  listGameRounds,
} from "@roll-and-call/database/games";
import { DEFAULT_PLAY_MINUTES } from "@roll-and-call/database/games/model";
import { Callout, Card, Container, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { GmOnlyNotice, LoginRequired } from "@/features/auth";
import { RoundPlanActions } from "@/features/edit-round-plan";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { ROUND_ROW_KIND } from "../model/round-row-kind";
import { roundRowViews } from "../model/round-row-views";
import { roundsSummary } from "../model/rounds-summary";
import { staleNotice } from "../model/stale-notice";
import { visibleRoundRows } from "../model/visible-round-rows";
import { FoldedRoundRows } from "./folded-round-rows";
import { NextScheduleCard } from "./next-schedule-card";
import { RoundRow } from "./round-row";
import { RoundsProgressCard } from "./rounds-progress-card";

const MINUTE_MS = 60_000;

interface GameRoundsViewProps {
  id: string;
}

// 다회차 GM의 회차 일정(시안 04-6 1).
export async function GameRoundsView({ id }: GameRoundsViewProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([
    getGameWithRoster({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!game) notFound();
  if (game.roundCount < 2) redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));
  const appBar = <AppBar back={`/games/${id}/manage`} title="회차 일정" />;
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

  const now = new Date();
  const rounds = await listGameRounds({ serverId: server.id, gameId: id });
  const summary = roundsSummary({ game, rounds, now });
  const ended = Boolean(game.finishedAt || game.cancelledAt);
  const coordinatingRound = rounds.find(
    (round) => round.status === "coordinating" && !round.startAt,
  );
  const coordination = coordinatingRound
    ? await getRoundCoordination({
        serverId: server.id,
        gameId: id,
        roundNo: coordinatingRound.roundNo,
      })
    : null;
  const { folded, shown } = visibleRoundRows(
    roundRowViews({
      rounds,
      now,
      canSchedule: !ended && game.roundScheduleKind === "coordinated",
      canMove: !ended,
      coordinationResponse: coordination,
    }),
  );
  const notice =
    !ended && game.roundScheduleKind === "coordinated" ? staleNotice({ rounds, now }) : null;
  const startedCount = rounds.filter((round) => round.startAt && round.startAt <= now).length;
  const lastRound = rounds.at(-1);
  const canAddRound = !lastRound?.attendanceConfirmedAt;
  const defaultMinutes =
    lastRound?.startAt && lastRound.plannedEndAt
      ? (lastRound.plannedEndAt.getTime() - lastRound.startAt.getTime()) / MINUTE_MS
      : (game.playMinutes ?? DEFAULT_PLAY_MINUTES);

  const nextView = [...folded, ...shown].find(
    (view) =>
      !isNull(view.scheduleRoundNo) &&
      (view.kind === ROUND_ROW_KIND.unscheduled || view.kind === ROUND_ROW_KIND.coordinating),
  );
  const progressCard = (
    <RoundsProgressCard
      title={game.title}
      finishedCount={summary.finishedCount}
      total={summary.total}
      early={summary.early}
      badges={summary.badges}
    />
  );
  const nextCard = nextView ? (
    <NextScheduleCard
      gameId={id}
      roundNo={nextView.scheduleRoundNo!}
      response={nextView.kind === ROUND_ROW_KIND.coordinating ? coordination : null}
    />
  ) : null;
  const planActions = ended ? null : (
    <RoundPlanActions
      gameId={id}
      roundCount={game.roundCount}
      startedCount={startedCount}
      designated={game.roundScheduleKind === "designated"}
      canAddRound={canAddRound}
      defaultMinutes={defaultMinutes}
    />
  );

  return (
    <PageShell
      readable
      appBar={appBar}
      panel={
        <>
          {progressCard}
          {nextCard}
          {planActions}
        </>
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="200" className="py-200">
            {notice && (
              <Callout.Root colorPalette={notice.warning ? "warning" : "gray"} size="sm">
                <Callout.Icon />
                <Callout.Description>{notice.text}</Callout.Description>
              </Callout.Root>
            )}
            <VStack gap="200" className="desktop:hidden">
              {progressCard}
              {nextCard}
            </VStack>
            <Card.Root
              radius={500}
              padding="none"
              className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
            >
              {folded.length > 0 && <FoldedRoundRows gameId={id} views={folded} />}
              {shown.map((view) => (
                <RoundRow key={view.key} gameId={id} view={view} />
              ))}
            </Card.Root>
            <div className="desktop:hidden">{planActions}</div>
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
