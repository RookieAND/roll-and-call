import { Progress, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { RosterAvatars } from "./roster-avatars";
import { RosterEmptyNote } from "./roster-empty-note";
import { RosterGroupHeader } from "./roster-group-header";
import type { DetailRosterMember } from "./roster-member-row";

interface RosterGroupSectionProps {
  label: string;
  members: DetailRosterMember[];
  capacity?: number;
  action?: ReactNode;
  emptyText?: string;
}

// 참여 · 대기 · (추첨의) 신청이 같은 UI를 쓴다 — 헤더 · 진행바 · 아바타 줄.
// 정원 줄(참여)은 초록으로 채운 만큼, 정원 밖 줄(대기·신청)은 옅은 인디고로 꽉 채운다.
export function RosterGroupSection({
  label,
  members,
  capacity,
  action,
  emptyText,
}: RosterGroupSectionProps) {
  const progress =
    capacity === undefined
      ? { value: 1, max: 1, variant: "tinted" as const }
      : {
          value: Math.min(members.length, capacity),
          max: capacity,
          colorPalette: "success" as const,
        };

  return (
    <VStack gap="125" render={<section />}>
      <RosterGroupHeader label={label} count={members.length} capacity={capacity} action={action} />
      {members.length > 0 && <Progress {...progress} className="w-full" />}
      {members.length > 0 ? (
        <RosterAvatars members={members} />
      ) : (
        emptyText && <RosterEmptyNote text={emptyText} />
      )}
    </VStack>
  );
}
