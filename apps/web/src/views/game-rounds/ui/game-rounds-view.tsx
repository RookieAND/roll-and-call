import { getGameWithRoster, listGameRounds } from "@roll-and-call/database/games";
import { DEFAULT_PLAY_MINUTES } from "@roll-and-call/database/games/model";
import { Card, Container, HStack, Text, VStack } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { GmOnlyNotice, LoginRequired } from "@/features/auth";
import { RoundPlanActions } from "@/features/edit-round-plan";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { roundRowViews } from "../model/round-row-views";
import { roundsSummary } from "../model/rounds-summary";
import { staleNotice } from "../model/stale-notice";
import { visibleRoundRows } from "../model/visible-round-rows";
import { FoldedRoundRows } from "./folded-round-rows";
import { RoundRow } from "./round-row";

const MINUTE_MS = 60_000;

interface GameRoundsViewProps {
  id: string;
}

// 다회차 GM의 회차 일정(시안 04-6 1). 일정 잡기·바꾸기는 C36-11에서 붙인다.
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
  const { folded, shown } = visibleRoundRows(roundRowViews({ rounds, now }));
  const ended = Boolean(game.finishedAt || game.cancelledAt);
  const notice =
    !ended && game.roundScheduleKind === "coordinated" ? staleNotice({ rounds, now }) : null;
  const startedCount = rounds.filter((round) => round.startAt && round.startAt <= now).length;
  const lastRound = rounds.at(-1);
  const canAddRound = !lastRound?.attendanceConfirmedAt;
  const defaultMinutes =
    lastRound?.startAt && lastRound.plannedEndAt
      ? (lastRound.plannedEndAt.getTime() - lastRound.startAt.getTime()) / MINUTE_MS
      : (game.playMinutes ?? DEFAULT_PLAY_MINUTES);

  return (
    <PageShell readable appBar={appBar}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="200" className="py-200">
            <VStack gap="050">
              <Text typography="heading3" weight="extrabold" render={<h2 />}>
                {summary.title}
              </Text>
              <Text typography="body3" foreground="muted">
                {summary.sub}
              </Text>
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
            {notice && (
              <HStack align="center" gap="075">
                {notice.warning && (
                  <TriangleAlert size={16} aria-hidden className="flex-none text-warning-600" />
                )}
                <Text typography="body4" foreground={notice.warning ? "normal" : "hint"}>
                  {notice.text}
                </Text>
              </HStack>
            )}
            {!ended && (
              <RoundPlanActions
                gameId={id}
                roundCount={game.roundCount}
                startedCount={startedCount}
                designated={game.roundScheduleKind === "designated"}
                canAddRound={canAddRound}
                defaultMinutes={defaultMinutes}
              />
            )}
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
