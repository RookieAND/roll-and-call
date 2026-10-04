import { Container, VStack } from "@roll-and-call/ui";
import { CircleCheck, Clock } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import {
  attendanceDeadline,
  isAttendancePastDeadline,
  isSessionEnded,
  splitRoster,
} from "@/entities/game";
import { GmOnlyNotice, LoginRequired } from "@/features/auth";
import { AttendancePanel, attendancePhaseOf, type Attendee } from "@/features/confirm-attendance";
import { formatDateTime, serverPath, toKst } from "@/shared/lib";
import { getCurrentSessionUser, getGameParticipants, getCurrentServer } from "@/shared/server";
import { AppBar, SummaryLine } from "@/shared/ui";

import { toAttendee } from "../model/to-attendee";
import { AttendanceHeader } from "./attendance-header";

export async function GameAttendanceView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [data, user] = await Promise.all([
    getGameParticipants({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!data) notFound();
  const { game } = data;

  if (!user) {
    return (
      <>
        <AppBar back={`/games/${id}`} title="출석 확인" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }
  if (user.id !== game.gmId) {
    return (
      <>
        <AppBar back={`/games/${id}`} title="출석 확인" />
        <Container size="sm">
          <div className="py-300">
            <GmOnlyNotice
              gameId={id}
              signedIn
              description="이 구인글의 출석 확인은 GM만 열 수 있습니다."
            />
          </div>
        </Container>
      </>
    );
  }

  const { confirmed, removed } = splitRoster(game.participants);
  const now = new Date();
  const ended = isSessionEnded(game, now);
  // 확정을 마친 뒤에도 읽기 전용으로 남아 있어야 "다시 고치기"로 돌아올 수 있다.
  // 기한이 지났는데 크론 전인 세션도 연다(자동 확정된 것으로 보인다).
  const reachable =
    Boolean(game.attendanceConfirmedAt) ||
    (confirmed.length > 0 && (ended || isAttendancePastDeadline({ ...game, now })));
  if (!reachable) {
    const fallback = ended ? "manage" : "participants";
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/${fallback}` }));
  }

  const attendees: Attendee[] = [
    ...confirmed.map((participant) => toAttendee({ participant, removed: false })),
    ...removed.map((participant) => toAttendee({ participant, removed: true })),
  ];
  const startedAt = formatDateTime(game.confirmedAt!);
  const sessionValue = game.endedAt
    ? `${startedAt} · ${toKst(game.endedAt).format("HH:mm")}에 마침`
    : startedAt;

  return (
    <>
      <AppBar back={`/games/${id}/manage`} title="출석 확인" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          <AttendanceHeader
            title={game.title}
            rule={game.rule}
            confirmedCount={confirmed.length}
            attendanceConfirmed={Boolean(game.attendanceConfirmedAt)}
          />
          <AttendancePanel
            gameId={id}
            attendees={attendees}
            phase={attendancePhaseOf({ game, now })}
            deadline={attendanceDeadline(game)!}
            attendanceConfirmedAt={game.attendanceConfirmedAt}
          >
            <SummaryLine
              icon={game.endedAt ? CircleCheck : Clock}
              tone="muted"
              label="세션 시각"
              value={sessionValue}
              badge={game.endedAt ? undefined : "끝남"}
            />
          </AttendancePanel>
        </VStack>
      </Container>
    </>
  );
}
