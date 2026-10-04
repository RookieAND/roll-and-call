import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { countConfirmed, SCHEDULE_MODE, splitRoster } from "@/entities/game";
import { formatDateTime, serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getGameParticipants, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { toDrawOutcome } from "../model/to-draw-outcome";
import { AppliedDraw } from "./applied-draw";
import { MyDrawResult } from "./my-draw-result";

interface DrawResultViewProps {
  id: string;
}

// 추첨한 순간 남긴 기록(drawResults)을 보여 준다.
export async function DrawResultView({ id }: DrawResultViewProps) {
  const server = await getCurrentServer();
  const [data, user] = await Promise.all([
    getGameParticipants({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!data) notFound();
  const { game } = data;

  if (isNull(game.drawnAt)) redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
  const drawn = game.drawResults.map((result) => ({
    ...result,
    drawRoll: result.roll,
    joinedAt: game.drawnAt!,
  }));
  if (!drawn.some((participant) => !isNull(participant.drawRoll))) {
    redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
  }

  // 기록에 남은 확정 수가 정원이다. 그 뒤 정원을 고쳐도 결과는 바뀌지 않는다.
  const outcome = toDrawOutcome({ participants: drawn, maxPlayers: countConfirmed(drawn) });
  const roster = splitRoster(game.participants);
  const mine = [...roster.confirmed, ...roster.waiting].find(
    (participant) => participant.userId === user?.id && !isNull(participant.drawRoll),
  );
  const needsAvailability =
    game.scheduleMode === SCHEDULE_MODE.coordinate && isNull(game.confirmedAt);

  let content = (
    <AppliedDraw
      gameId={id}
      title={game.title}
      outcome={outcome}
      drawnAtLabel={formatDateTime(game.drawnAt)}
    />
  );
  if (mine && user) {
    content = (
      <MyDrawResult
        gameId={id}
        title={game.title}
        outcome={outcome}
        meUserId={user.id}
        waitlistRank={mine.waitlistRank}
        needsAvailability={needsAvailability}
      />
    );
  }

  return (
    <>
      <AppBar back={`/games/${id}`} title="추첨 결과" />
      <Container size="sm" className="py-200">
        {content}
      </Container>
    </>
  );
}
