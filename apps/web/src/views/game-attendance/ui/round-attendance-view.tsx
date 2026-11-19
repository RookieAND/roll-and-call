import {
  getGameParticipants,
  getRoundAttendance,
  listGameRounds,
} from "@roll-and-call/database/games";
import { isRoundOpen, roundAttendanceDeadline } from "@roll-and-call/database/games/model";
import { Callout, HStack, Text, VStack } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { roundSlotLabel, splitRoster } from "@/entities/game";
import {
  RoundAttendancePanel,
  SkipRoundButton,
  type Attendee,
} from "@/features/confirm-attendance";
import { formatDateTime, serverPath } from "@/shared/lib";
import { AppBar } from "@/shared/ui";

import { attendanceRoundNo } from "../model/attendance-round-no";
import { toAttendee } from "../model/to-attendee";

type RosterGame = NonNullable<Awaited<ReturnType<typeof getGameParticipants>>>["game"];

interface RoundAttendanceViewProps {
  server: { id: string; slug: string };
  game: RosterGame;
  requestedRound: string | undefined;
}

const NO_RECORD_NOTICE =
  "여러 번 진행하는 세션은 빠진 회차가 순위에 들어가지 않을 뿐, 불참 기록은 남지 않습니다.";

// 다회차 회차의 출석 확인(?round=n). 단발 출석 화면과 같은 틀에 회차 제목·일시와 생략 입구를 더한다.
export async function RoundAttendanceView({
  server,
  game,
  requestedRound,
}: RoundAttendanceViewProps) {
  const now = new Date();
  const rounds = await listGameRounds({ serverId: server.id, gameId: game.id });
  const roundNo = attendanceRoundNo({ rounds, requested: requestedRound, now });
  const data = await getRoundAttendance({ serverId: server.id, gameId: game.id, roundNo });
  if (!data) notFound();
  const { round, attendance, reviewCount } = data;
  if (!round.startAt || round.startAt > now || !round.plannedEndAt) {
    redirect(serverPath({ slug: server.slug, path: `/games/${game.id}/rounds` }));
  }

  const missed = new Set(attendance.filter((row) => !row.attended).map((row) => row.userId));
  const { confirmed } = splitRoster(game.participants);
  const attendees: Attendee[] = confirmed.map((participant) => ({
    ...toAttendee({ participant, removed: false }),
    absent: missed.has(participant.userId),
    staffCancelled: false,
    staffAdded: false,
  }));
  const open = isRoundOpen({ round, now });
  const deadline = roundAttendanceDeadline(round)!;
  const guide = (
    <Text typography="body4" foreground="hint">
      {open
        ? `${formatDateTime(deadline)}까지 고칠 수 있습니다.`
        : "출석을 고칠 수 있는 기간이 지났습니다."}
    </Text>
  );
  const header = (
    <VStack gap="050">
      <Text typography="body4" foreground="muted">
        {roundSlotLabel({ startsAt: round.startAt, endsAt: round.endedAt ?? round.plannedEndAt })}
      </Text>
      <Text typography="heading3" weight="extrabold" render={<h2 />}>
        {roundNo}회차 출석 확인
      </Text>
    </VStack>
  );

  return (
    <RoundAttendancePanel
      appBar={<AppBar back={`/games/${game.id}/rounds`} title="출석 확인" />}
      header={header}
      gameId={game.id}
      roundNo={roundNo}
      attendees={attendees}
      confirmed={Boolean(round.attendanceConfirmedAt)}
      open={open}
      guide={guide}
      footer={
        open &&
        !game.finishedAt && (
          <HStack justify="center">
            <SkipRoundButton
              gameId={game.id}
              roundNo={roundNo}
              roundCount={game.roundCount}
              designated={game.roundScheduleKind === "designated"}
              reviewCount={reviewCount}
            />
          </HStack>
        )
      }
    >
      <Callout.Root colorPalette="gray">
        <Callout.Icon />
        <Callout.Description>{NO_RECORD_NOTICE}</Callout.Description>
      </Callout.Root>
    </RoundAttendancePanel>
  );
}
