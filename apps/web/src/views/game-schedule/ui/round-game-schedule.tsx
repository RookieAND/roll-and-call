import { getRoundCoordination } from "@roll-and-call/database/games";
import { awaitingResultMethod } from "@roll-and-call/database/games/model";
import { Badge, Text, VStack } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { isGameGm, PARTICIPANT_STATUS } from "@/entities/game";
import {
  COORDINATION_PHASE,
  coordinationPhase,
  periodText,
  remainingText,
} from "@/features/schedule-round";
import { buildDayColumns, buildTimeRows, serverPath, toKstDateInput } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser, getGameById } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { getScheduleAvailability } from "../api/load-availability";
import { roundBodyModeOf } from "../model/round-body-mode-of";
import { ScheduleBody } from "./schedule-body";

interface RoundGameScheduleProps {
  id: string;
  roundNo: number;
}

// 다회차 구인의 n회차(n ≥ 2) 가능 시간 화면.
export async function RoundGameSchedule({ id, roundNo }: RoundGameScheduleProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game || game.roundCount < roundNo) notFound();
  const coordination = await getRoundCoordination({ serverId: server.id, gameId: id, roundNo });
  const viewerId = user?.id ?? null;
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  if (
    !coordination ||
    !coordination.start ||
    !coordination.end ||
    coordination.windowStartHour === null ||
    coordination.windowEndHour === null
  ) {
    const path = isGm ? `/games/${id}/rounds/${roundNo}/schedule` : `/games/${id}`;
    redirect(serverPath({ slug: server.slug, path }));
  }

  const today = toKstDateInput(new Date());
  const phase = coordinationPhase({
    status: coordination.status,
    end: coordination.end,
    today,
  });
  const canPaint =
    isGm ||
    game.participants.some(
      (participant) =>
        participant.userId === viewerId && participant.status === PARTICIPANT_STATUS.confirmed,
    );
  const mode = roundBodyModeOf({
    isOpen: phase === COORDINATION_PHASE.open,
    canPaint,
    awaitingResult: awaitingResultMethod(game),
  });
  const days = buildDayColumns({ rangeStart: coordination.start, rangeEnd: coordination.end });
  const timeRows = buildTimeRows({
    startHour: coordination.windowStartHour,
    endHour: coordination.windowEndHour,
  });
  const initialAvailability = await getScheduleAvailability({
    gameId: id,
    userId: viewerId,
    roundNo,
  });
  const members = [
    ...(game.gm ? [{ name: game.gm.username, isGm: true }] : []),
    ...game.participants
      .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
      .map((participant) => ({ name: participant.user?.username ?? "?", isGm: false })),
  ];
  const period = periodText({ start: coordination.start, end: coordination.end });
  const subline =
    phase === COORDINATION_PHASE.open
      ? `${period} · ${remainingText({ end: coordination.end, today })}`
      : period;

  const appBar = (
    <AppBar
      back={`/games/${id}`}
      title="일정 조율"
      subtitle={game.title}
      action={isGm && <Badge colorPalette="primary">GM</Badge>}
    />
  );
  const header = (
    <VStack gap="050" className="pb-150">
      <Text typography="heading3" weight="extrabold" render={<h2 />}>
        {roundNo}회차 가능 시간
      </Text>
      <Text typography="body3" foreground="muted">
        {subline}
      </Text>
    </VStack>
  );

  return (
    <ScheduleBody
      appBar={appBar}
      gameId={id}
      roundNo={roundNo}
      header={header}
      days={days}
      timeRows={timeRows}
      initialAvailability={initialAvailability}
      mode={mode}
      capacity={game.maxPlayers + 1}
      gmName={game.gm?.username}
      members={members}
    />
  );
}
