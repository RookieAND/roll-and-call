"use client";

import { Text, VStack } from "@trpg/ui";
import { useState } from "react";

import { MemberSheet } from "@/features/adjust-roster";
import { ExpandableRows } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { availabilityNote } from "./availability-note";
import { MemberMenuButton } from "./member-menu-button";
import { RosterQueue } from "./roster-queue";
import { RosterRow } from "./roster-row";
import { UnsubmittedNote } from "./unsubmitted-note";

// 확정과 대기는 제목 붙은 두 목록이다. 한 사람이 어느 쪽인지는 배지가 아니라 위치가 말한다.
export function RosterQueues({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  summary,
  isCoordinate,
  locked,
}: {
  gameId: string;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
  locked: boolean;
}) {
  const [menuMember, setMenuMember] = useState<ManagedMember | null>(null);

  const rowAction = (member: ManagedMember) =>
    locked ? null : (
      <MemberMenuButton username={member.username} onClick={() => setMenuMember(member)} />
    );
  const noteOf = (member: ManagedMember) =>
    isCoordinate ? availabilityNote(member.hasAvailability) : undefined;
  const waitingCaption = summary.drawnAtLabel ? "추첨으로 정해진 순서" : "신청 순서";

  return (
    <VStack gap="250">
      <RosterQueue
        label="확정"
        count={confirmed.length}
        footnote={
          summary.unsubmittedCount > 0 && <UnsubmittedNote count={summary.unsubmittedCount} />
        }
      >
        {confirmed.length === 0 ? (
          <div className="px-150 py-200">
            <Text typography="body3" foreground="muted">
              아직 확정된 참여자가 없습니다.
            </Text>
          </div>
        ) : (
          confirmed.map((member) => (
            <RosterRow
              key={member.userId}
              member={member}
              note={noteOf(member)}
              warn={isCoordinate && !member.hasAvailability}
              action={rowAction(member)}
            />
          ))
        )}
      </RosterQueue>

      {waiting.length > 0 && (
        <RosterQueue
          label="대기"
          count={waiting.length}
          caption={waitingCaption}
          footnote={
            summary.isFull &&
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
                rank={member.waitlistRank}
                note={noteOf(member)}
                warn={isCoordinate && !member.hasAvailability}
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
        onClose={() => setMenuMember(null)}
      />
    </VStack>
  );
}
