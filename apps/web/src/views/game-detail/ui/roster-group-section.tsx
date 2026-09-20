import { Progress, Text, VStack } from "@trpg/ui";
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
  note?: string;
}

// 참여자 · 대기 · (추첨의) 신청이 같은 UI를 쓴다 — 헤더 · 진행바 · 아바타 줄.
export function RosterGroupSection({
  label,
  members,
  capacity,
  action,
  emptyText,
  note,
}: RosterGroupSectionProps) {
  // 정원이 없는 묶음(대기)도 같은 자리에 같은 굵기의 줄을 둔다 — 색으로만 구분한다.
  const progress =
    capacity === undefined
      ? { value: 1, max: 1, color: "waiting" as const }
      : {
          value: Math.min(members.length, capacity),
          max: capacity,
          color: members.length >= capacity ? ("confirmed" as const) : ("recruiting" as const),
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
      {note && (
        <Text typography="body4" foreground="hint" render={<p />}>
          {note}
        </Text>
      )}
    </VStack>
  );
}
