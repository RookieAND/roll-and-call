"use client";

import { Button } from "@trpg/ui";
import { useState } from "react";

import { formatDate } from "@/shared/lib";

import type { ManagedMember } from "../model/managed-member";
import { availabilityNote } from "./availability-note";
import { RosterQueue } from "./roster-queue";
import { RosterRow } from "./roster-row";
import { UnsubmittedNote } from "./unsubmitted-note";

const PREVIEW_COUNT = 3;

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
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? applicants : applicants.slice(0, PREVIEW_COUNT);
  const restCount = applicants.length - shown.length;

  return (
    <RosterQueue
      label="신청자"
      count={applicants.length}
      caption="신청 순서 · 뽑기 전에는 순번이 없습니다"
      footnote={unsubmittedCount > 0 && <UnsubmittedNote count={unsubmittedCount} />}
    >
      {shown.map((member) => (
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
      {restCount > 0 && (
        <Button
          variant="ghost"
          className="h-12 w-full rounded-none border-t border-gray-100"
          onClick={() => setExpanded(true)}
        >
          {restCount}명 더 보기
        </Button>
      )}
    </RosterQueue>
  );
}
