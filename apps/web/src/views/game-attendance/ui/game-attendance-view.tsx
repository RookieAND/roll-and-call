import { Container, VStack } from "@roll-and-call/ui";
import { Clock } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { isAttendanceDue, splitRoster } from "@/entities/game";
import { LoginRequired } from "@/features/auth";
import { AttendanceForm, ConfirmedAttendance, type Attendee } from "@/features/confirm-attendance";
import { formatDateTime } from "@/shared/lib";
import { getCurrentUser, getGameParticipants } from "@/shared/server";
import { AppBar, SummaryLine } from "@/shared/ui";

import { AttendanceGuide } from "./attendance-guide";
import { AttendanceHeader } from "./attendance-header";

// 왔는지 안 왔는지만 정하는 자리다. 명단을 고치는 일은 참여자 관리가 맡는다.
export async function GameAttendanceView({ id }: { id: string }) {
  const [data, user] = await Promise.all([getGameParticipants(id), getCurrentUser()]);
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
  if (user.id !== game.gmId) redirect(`/games/${id}`);

  const confirmed = splitRoster(game.participants).confirmed;
  // 확정을 마친 뒤에도 읽기 전용으로 남아 있어야 "다시 고치기"로 돌아올 수 있다.
  const reachable = game.attendanceConfirmedAt || isAttendanceDue(game, confirmed.length);
  if (!reachable) redirect(`/games/${id}/participants`);

  const attendees: Attendee[] = confirmed.map((participant) => ({
    userId: participant.userId,
    username: participant.user?.username ?? "익명",
    avatarUrl: participant.user?.avatarUrl ?? null,
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
