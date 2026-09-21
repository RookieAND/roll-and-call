import { Text } from "@trpg/ui";

import { DirectConfirmButton } from "@/features/adjust-roster";
import { formatDate } from "@/shared/lib";
import { ExpandableRows } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import { availabilityNote } from "./availability-note";
import { RosterQueue } from "./roster-queue";
import { RosterRow } from "./roster-row";

interface ApplicantListProps {
  gameId: string;
  applicants: ManagedMember[];
  preConfirmedCount: number;
  maxPlayers: number;
  unsubmittedCount: number;
  isCoordinate: boolean;
  locked: boolean;
}

// 뽑기 전에는 모두 같은 신청자다. 순번을 붙이면 먼저 신청한 사람이 유리해 보인다.
// 직접 확정한 사람만 이름 옆 태그로 가르고, 추첨에서 빠진다고 적는다.
export function ApplicantList({
  gameId,
  applicants,
  preConfirmedCount,
  maxPlayers,
  unsubmittedCount,
  isCoordinate,
  locked,
}: ApplicantListProps) {
  return (
    <RosterQueue
      label="신청자"
      count={applicants.length}
      caption="신청 순서 · 뽑기 전에는 순번이 없습니다"
      action={
        !locked && (
          <DirectConfirmButton
            gameId={gameId}
            confirmedCount={preConfirmedCount}
            maxPlayers={maxPlayers}
          />
        )
      }
      footnote={
        unsubmittedCount > 0 && (
          <Text typography="body4" foreground="hint" render={<p />}>
            가능 시간을 내지 않은 {unsubmittedCount}명이 있습니다.
          </Text>
        )
      }
    >
      <ExpandableRows>
        {applicants.map((member) => {
          const preConfirmed = member.waitlistRank === null;
          return (
            <RosterRow
              key={member.userId}
              member={member}
              preConfirmed={preConfirmed}
              note={[
                `${formatDate(member.joinedAt)} 신청`,
                preConfirmed
                  ? "추첨에서 빠짐"
                  : isCoordinate
                    ? availabilityNote(member.hasAvailability)
                    : null,
              ]
                .filter(Boolean)
                .join(" · ")}
              warn={!preConfirmed && isCoordinate && !member.hasAvailability}
              action={null}
            />
          );
        })}
      </ExpandableRows>
    </RosterQueue>
  );
}
