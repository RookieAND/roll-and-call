import { Text } from "@trpg/ui";

import { formatDate } from "@/shared/lib";
import { ExpandableRows } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import { availabilityNote } from "./availability-note";
import { RosterQueue } from "./roster-queue";
import { RosterRow } from "./roster-row";

// 뽑기 전에는 모두 같은 신청자다. 순번을 붙이면 먼저 신청한 사람이 유리해 보인다.
export function ApplicantList({
  applicants,
  unsubmittedCount,
  isCoordinate,
}: {
  applicants: ManagedMember[];
  unsubmittedCount: number;
  isCoordinate: boolean;
}) {
  return (
    <RosterQueue
      label="신청자"
      count={applicants.length}
      caption="신청 순서 · 뽑기 전에는 순번이 없습니다"
      footnote={
        unsubmittedCount > 0 && (
          <Text typography="body4" foreground="hint" render={<p />}>
            가능 시간을 내지 않은 {unsubmittedCount}명이 있습니다.
          </Text>
        )
      }
    >
      <ExpandableRows>
        {applicants.map((member) => (
          <RosterRow
            key={member.userId}
            member={member}
            note={[
              `${formatDate(member.joinedAt)} 신청`,
              isCoordinate ? availabilityNote(member.hasAvailability) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
            warn={isCoordinate && !member.hasAvailability}
            action={null}
          />
        ))}
      </ExpandableRows>
    </RosterQueue>
  );
}
