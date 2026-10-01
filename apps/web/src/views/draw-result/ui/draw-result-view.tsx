import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { countConfirmed, SCHEDULE_MODE, splitRoster } from "@/entities/game";
import { formatDateTime, serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getGameParticipants, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { toDrawOutcome } from "../model/to-draw-outcome";
import { AppliedDraw } from "./applied-draw";
import { GmPendingDraw } from "./gm-pending-draw";
import { MyDrawResult } from "./my-draw-result";

interface DrawResultViewProps {
  id: string;
}

// 적용 전에는 GM만 본다. 적용한 순간부터 신청자 전원의 값이 공개되고, 그때 남긴 기록(drawResults)을 보여 준다.
export async function DrawResultView({ id }: DrawResultViewProps) {
  const server = await getCurrentServer();
  const [data, user] = await Promise.all([
    getGameParticipants({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!data) notFound();
  const { game } = data;

  const isGm = user?.id === game.gmId;
  const applied = game.drawnAt !== null;
  const drawn = applied
    ? game.drawResults.map((result) => ({
        ...result,
        drawRoll: result.roll,
        joinedAt: game.drawnAt!,
      }))
    : game.participants;
  const hasRolls = drawn.some((participant) => participant.drawRoll !== null);
  if (!hasRolls || (!applied && !isGm))
    redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));

  // 적용한 뒤에는 기록에 남은 확정 수가 정원이다. 그 뒤 정원을 고쳐도 결과는 바뀌지 않는다.
  const outcome = toDrawOutcome({
    participants: drawn,
    maxPlayers: applied ? countConfirmed(drawn) : game.maxPlayers,
  });
  const roster = splitRoster(game.participants);
  const mine = [...roster.confirmed, ...roster.waiting].find(
    (participant) => participant.userId === user?.id && participant.drawRoll !== null,
  );
  const needsAvailability =
    game.scheduleMode === SCHEDULE_MODE.coordinate && game.confirmedAt === null;

  let content = <GmPendingDraw gameId={id} title={game.title} outcome={outcome} />;
  if (applied && mine && user) {
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
  } else if (applied) {
    content = (
      <AppliedDraw
        gameId={id}
        title={game.title}
        outcome={outcome}
        drawnAtLabel={formatDateTime(game.drawnAt!)}
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
