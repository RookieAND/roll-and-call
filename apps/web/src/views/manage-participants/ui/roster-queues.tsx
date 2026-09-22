"use client";

import { HStack, Text, VStack } from "@trpg/ui";
import { useState } from "react";

import { DirectConfirmButton, MemberSheet } from "@/features/adjust-roster";
import { toKst } from "@/shared/lib";
import { ExpandableRows } from "@/shared/ui";

import { ATTENDANCE_STAGE, type AttendanceStage } from "../model/attendance-stage";
import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { AttendanceBadge } from "./attendance-badge";
import { availabilityNote } from "./availability-note";
import { DrawResultLink } from "./draw-result-link";
import { LockedRosterNote } from "./locked-roster-note";
import { MemberMenuButton } from "./member-menu-button";
import { RosterQueue } from "./roster-queue";
import { RosterRow } from "./roster-row";
import { UnsubmittedNote } from "./unsubmitted-note";

const ENDED_PREVIEW_COUNT = 2;

interface RosterQueuesProps {
  gameId: string;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
  locked: boolean;
  attendanceStage: AttendanceStage | null;
}

// 확정과 대기는 제목 붙은 두 목록이다. 한 사람이 어느 쪽인지는 배지가 아니라 위치가 말한다.
// 뽑기 전에는 대기 자리에 순번 없는 신청자가 선다. 먼저 신청한 사람이 유리해 보이지 않게 한다.
export function RosterQueues({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  summary,
  isCoordinate,
  locked,
  attendanceStage,
}: RosterQueuesProps) {
  const [menuMember, setMenuMember] = useState<ManagedMember | null>(null);

  // 세션이 끝난 뒤 행에서 읽는 것은 출석 하나다.
  const rowAction = (member: ManagedMember) =>
    attendanceStage ? (
      <AttendanceBadge stage={attendanceStage} absent={member.absent} />
    ) : locked ? null : (
      <MemberMenuButton username={member.username} onClick={() => setMenuMember(member)} />
    );
  const { beforeDraw } = summary;
  const noteOf = (member: ManagedMember) =>
    isCoordinate && !attendanceStage ? availabilityNote(member.hasAvailability) : undefined;
  const warnOf = (member: ManagedMember) =>
    isCoordinate && !attendanceStage && !member.hasAvailability;
  const waitingCaption = summary.drawnAtLabel ? "추첨으로 정해진 순서" : "신청 순서";
  const confirmedFootnote = locked ? (
    <LockedRosterNote attendanceChecked={attendanceStage === ATTENDANCE_STAGE.done} />
  ) : (
    summary.unsubmittedCount > 0 && <UnsubmittedNote count={summary.unsubmittedCount} />
  );
  const drawResultLink = summary.hasDrawResult && <DrawResultLink gameId={gameId} />;
  const confirmedAction = (drawResultLink || !locked) && (
    <HStack align="center" gap="150">
      {drawResultLink}
      {!locked && (
        <DirectConfirmButton
          gameId={gameId}
          confirmedCount={confirmed.length}
          maxPlayers={maxPlayers}
        />
      )}
    </HStack>
  );
  const confirmedRows = confirmed.map((member) => (
    <RosterRow
      key={member.userId}
      member={member}
      note={noteOf(member)}
      warn={warnOf(member)}
      action={rowAction(member)}
    />
  ));

  return (
    <VStack gap="250">
      <RosterQueue
        label="확정"
        count={confirmed.length}
        action={confirmedAction}
        footnote={confirmedFootnote}
        emptyState={
          confirmed.length === 0 && (
            <VStack gap="075">
              <Text typography="subtitle2" weight="bold">
                아직 확정한 참여자가 없습니다
              </Text>
              {beforeDraw && (
                <Text typography="body4" foreground="muted" render={<p />}>
                  {maxPlayers}자리 모두 추첨으로 정해집니다.
                </Text>
              )}
            </VStack>
          )
        }
      >
        {attendanceStage ? (
          <ExpandableRows previewCount={ENDED_PREVIEW_COUNT}>{confirmedRows}</ExpandableRows>
        ) : (
          confirmedRows
        )}
      </RosterQueue>

      {waiting.length > 0 && !attendanceStage && (
        <RosterQueue
          label={beforeDraw ? "신청자" : "대기"}
          count={waiting.length}
          caption={waitingCaption}
          footnote={
            summary.isFull &&
            !beforeDraw &&
            !locked && (
              <Text typography="body4" foreground="hint" render={<p />}>
                정원이 차 있어 바로 확정할 수 없습니다.
                <br />
                확정에서 한 명을 대기로 옮기면 자리가 납니다.
              </Text>
            )
          }
        >
          <ExpandableRows>
            {waiting.map((member) => (
              <RosterRow
                key={member.userId}
                member={member}
                rank={beforeDraw ? null : member.waitlistRank}
                note={`${toKst(member.joinedAt).format("M월 D일 HH:mm:ss")} 신청`}
                action={rowAction(member)}
              />
            ))}
          </ExpandableRows>
        </RosterQueue>
      )}

      <MemberSheet
        gameId={gameId}
        member={menuMember}
        confirmedCount={confirmed.length}
        waitingCount={waiting.length}
        maxPlayers={maxPlayers}
        isCoordinate={isCoordinate}
        beforeDraw={beforeDraw}
        onClose={() => setMenuMember(null)}
      />
    </VStack>
  );
}
