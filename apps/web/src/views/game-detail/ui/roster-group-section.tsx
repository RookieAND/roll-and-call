import { AvatarGroup, HStack, Progress, Text, VStack } from "@trpg/ui";
import type { ReactNode } from "react";

import type { DetailRosterMember } from "./roster-member-row";

const MAX_AVATARS = 5;

// 참여자 · 대기 · (추첨의) 신청이 같은 UI를 쓴다 — 헤더 · 진행바 · 아바타 줄.
export function RosterGroupSection({
  label,
  members,
  capacity,
  action,
  emptyText,
  note,
}: {
  label: string;
  members: DetailRosterMember[];
  capacity?: number;
  action?: ReactNode;
  emptyText?: string;
  note?: string;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <HStack align="center" gap={2}>
        <Text typography="heading3" render={<h2 />}>
          {label}
        </Text>
        <Text typography="subtitle2" className="tabular-nums">
          {members.length}명
        </Text>
        {capacity !== undefined && (
          <Text typography="body4" foreground="hint" className="tabular-nums">
            정원 {capacity}명
          </Text>
        )}
        <span className="flex-1" />
        {action}
      </HStack>

      {capacity !== undefined && (
        <Progress
          value={Math.min(members.length, capacity)}
          max={capacity}
          color={members.length >= capacity ? "closed" : "recruiting"}
          className="w-full"
        />
      )}

      {members.length === 0 ? (
        emptyText && (
          <Text typography="body3" foreground="muted" render={<p />}>
            {emptyText}
          </Text>
        )
      ) : (
        <AvatarGroup
          max={MAX_AVATARS}
          size="stack"
          people={members.map((member) => ({
            src: member.user?.avatarUrl,
            name: member.user?.username,
          }))}
        />
      )}

      {note && (
        <Text typography="body4" foreground="hint" render={<p />}>
          {note}
        </Text>
      )}
    </section>
  );
}
