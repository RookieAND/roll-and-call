import { Container, VStack } from "@roll-and-call/ui";
import { Clock } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { isAttendanceDue, splitRoster } from "@/entities/game";
import { GmOnlyNotice, LoginRequired } from "@/features/auth";
import { AttendanceForm, ConfirmedAttendance, type Attendee } from "@/features/confirm-attendance";
import { formatDateTime, serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getGameParticipants, getCurrentServer } from "@/shared/server";
import { AppBar, SummaryLine } from "@/shared/ui";

import { AttendanceGuide } from "./attendance-guide";
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

  const confirmed = splitRoster(game.participants).confirmed;
  // 확정을 마친 뒤에도 읽기 전용으로 남아 있어야 "다시 고치기"로 돌아올 수 있다.
  const reachable =
    game.attendanceConfirmedAt || isAttendanceDue({ game, confirmedCount: confirmed.length });
  if (!reachable) redirect(serverPath({ slug: server.slug, path: `/games/${id}/participants` }));

  const attendees: Attendee[] = confirmed.map((participant) => ({
    userId: participant.userId,
    username: participant.user?.username ?? "익명",
    avatarUrl: participant.user?.avatarUrl ?? null,
    bio: participant.user?.bio ?? null,
    absent: participant.absent,
  }));

  const sessionInfo = (
    <>
      <SummaryLine
        icon={Clock}
        tone="muted"
        label="세션 시각"
        value={formatDateTime(game.confirmedAt!)}
        badge="끝남"
      />
      <AttendanceGuide attendanceConfirmedAt={game.attendanceConfirmedAt} />
    </>
  );

  return (
    <>
      <AppBar back={`/games/${id}/participants`} title="출석 확인" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          <AttendanceHeader
            title={game.title}
            rule={game.rule}
            confirmedCount={attendees.length}
            attendanceConfirmed={Boolean(game.attendanceConfirmedAt)}
          />
          {game.attendanceConfirmedAt ? (
            <ConfirmedAttendance gameId={id} attendees={attendees}>
              {sessionInfo}
            </ConfirmedAttendance>
          ) : (
            <AttendanceForm gameId={id} attendees={attendees}>
              {sessionInfo}
            </AttendanceForm>
          )}
        </VStack>
      </Container>
    </>
  );
}
