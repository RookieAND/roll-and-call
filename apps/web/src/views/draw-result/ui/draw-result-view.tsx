import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { SCHEDULE_MODE, splitRoster } from "@/entities/game";
import { formatDateTime } from "@/shared/lib";
import { getCurrentUser, getGameParticipants } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { toDrawOutcome } from "../model/to-draw-outcome";
import { AppliedDraw } from "./applied-draw";
import { GmPendingDraw } from "./gm-pending-draw";
import { MyDrawResult } from "./my-draw-result";

interface DrawResultViewProps {
  id: string;
}

// 적용 전에는 GM만 본다. 적용한 순간부터 신청자 전원의 값이 공개된다.
export async function DrawResultView({ id }: DrawResultViewProps) {
  const [data, user] = await Promise.all([getGameParticipants(id), getCurrentUser()]);
  if (!data) notFound();
  const { game } = data;

  const isGm = user?.id === game.gmId;
  const applied = game.drawnAt !== null;
  const hasRolls = game.participants.some((participant) => participant.drawRoll !== null);
  if (!hasRolls || (!applied && !isGm)) redirect(`/games/${id}`);

  const outcome = toDrawOutcome(game.participants, game.maxPlayers);
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
