import {
  getGameParticipants,
  getGameWithRoster,
  listGameRounds,
} from "@roll-and-call/database/games";
import { DEFAULT_PLAY_MINUTES, schedulableRoundNo } from "@roll-and-call/database/games/model";
import { Callout, Container, Text, VStack } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { roundSlotLabel } from "@/entities/game";
import { GmOnlyNotice, LoginRequired } from "@/features/auth";
import { RoundScheduleForm } from "@/features/schedule-round";
import { serverPath, toKstDateTimeInput } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

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
  const [rounds, detail] = await Promise.all([
    listGameRounds({ serverId: server.id, gameId: id }),
    getGameParticipants({ serverId: server.id, gameId: id }),
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
            <RoundScheduleForm
              gameId={id}
              roundNo={roundNo}
              mode={dated ? "move" : "set"}
              initialStartsAt={target.startAt ? toKstDateTimeInput(target.startAt) : ""}
              initialEndsAt={target.plannedEndAt ? toKstDateTimeInput(target.plannedEndAt) : ""}
              defaultMinutes={playMinutes}
              designated={game.roundScheduleKind === "designated"}
              laterRounds={laterRounds}
              nicknames={nicknames}
            />
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
