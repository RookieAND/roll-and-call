import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { countConfirmed, isSessionEnded, RECRUIT_METHOD, splitRoster } from "@/entities/game";
import { QUERY_NOTICE, QUERY_NOTICE_PARAM, serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getGameParticipants, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { toDrawOutcome } from "../model/to-draw-outcome";
import { AppliedDraw } from "./applied-draw";
import { EmptyDraw } from "./empty-draw";
import { MyDrawResult } from "./my-draw-result";
import { NoDrawEmpty } from "./no-draw-empty";

interface DrawResultViewProps {
  id: string;
}

// 두 통은 추첨한 순간 남긴 기록(drawResults)이라 그 뒤 명단을 고쳐도 바뀌지 않는다.
// 굴린 신청자 본인이 지금 명단에 있으면 내 결과(나), 그 밖(GM·직접 확정자·나간 사람·비참여자)은 결과판(다)이다.
export async function DrawResultView({ id }: DrawResultViewProps) {
  const server = await getCurrentServer();
  const [data, user] = await Promise.all([
    getGameParticipants({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!data) notFound();
  const { game } = data;

  const noResultPath = serverPath({
    slug: server.slug,
    path: `/games/${id}?${QUERY_NOTICE_PARAM}=${QUERY_NOTICE.noDrawResult}`,
  });
  const drawnAt = game.drawnAt;
  if (game.recruitMethod !== RECRUIT_METHOD.lottery) redirect(noResultPath);
  const resultAppBar = <AppBar back={`/games/${id}`} title="추첨 결과" />;
  if (isNull(drawnAt)) {
    return (
      <>
        {resultAppBar}
        <NoDrawEmpty gameId={id} />
      </>
    );
  }

  const drawn = game.drawResults.map((result) => ({
    ...result,
    drawRoll: result.roll,
    joinedAt: drawnAt,
  }));
  const myResult = drawn.find((result) => result.userId === user?.id && !isNull(result.drawRoll));
  const hasRolls = drawn.some((result) => !isNull(result.drawRoll));
  // 1d100 도입 전 추첨은 순위만 있고 굴린 값이 없다. 신청자 없이 마감된 글은 순위도 없다.
  const legacyDraw = game.participants.some((participant) => !isNull(participant.drawRank));
  if (!hasRolls && legacyDraw) {
    return (
      <>
        {resultAppBar}
        <NoDrawEmpty gameId={id} />
      </>
    );
  }

  const outcome = toDrawOutcome({ participants: drawn, maxPlayers: countConfirmed(drawn) });
  const roster = splitRoster(game.participants);
  const mine = myResult
    ? [...roster.confirmed, ...roster.waiting].find(
        (participant) => participant.userId === myResult.userId,
      )
    : undefined;

  let content = <AppliedDraw gameId={id} title={game.title} outcome={outcome} drawnAt={drawnAt} />;
  if (!hasRolls) content = <EmptyDraw gameId={id} title={game.title} />;
  else if (mine) {
    content = (
      <MyDrawResult
        gameId={id}
        title={game.title}
        outcome={outcome}
        drawnAt={drawnAt}
        meUserId={mine.userId}
        waitlistRank={mine.waitlistRank}
        scheduleMode={game.scheduleMode}
        confirmedAt={game.confirmedAt}
        sessionEnded={isSessionEnded(game)}
      />
    );
  }

  return (
    <>
      {resultAppBar}
      <Container size="sm" className="py-200">
        {content}
      </Container>
    </>
  );
}
