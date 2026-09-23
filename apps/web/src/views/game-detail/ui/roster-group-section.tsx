import { Progress, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { RosterGauge } from "../model/roster-gauge";
import { rosterProgress } from "../model/roster-progress";
import { RosterAvatars } from "./roster-avatars";
import { RosterEmptyNote } from "./roster-empty-note";
import { RosterGroupHeader } from "./roster-group-header";
import type { DetailRosterMember } from "./roster-member-row";

interface RosterGroupSectionProps {
  label: string;
  gauge: RosterGauge;
  members: DetailRosterMember[];
  capacity?: number;
  action?: ReactNode;
  emptyText?: string;
}

// 참여 · 대기 · (추첨의) 신청이 같은 UI를 쓴다 — 헤더 · 진행바 · 아바타 줄.
export function RosterGroupSection({
  label,
  gauge,
  members,
  capacity,
  action,
  emptyText,
}: RosterGroupSectionProps) {
  return (
    <VStack gap="125" render={<section />}>
      <RosterGroupHeader label={label} count={members.length} capacity={capacity} action={action} />
      <Progress
        {...rosterProgress({ gauge, count: members.length, capacity })}
        aria-label={label}
        className="w-full"
      />
      {members.length > 0 ? (
        <RosterAvatars members={members} />
      ) : (
        emptyText && <RosterEmptyNote text={emptyText} />
      )}
    </VStack>
  );
}
