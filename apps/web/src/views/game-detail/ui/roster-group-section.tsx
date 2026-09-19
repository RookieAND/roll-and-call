import { AvatarGroup, HStack, Progress, Text } from "@trpg/ui";
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
  // 정원이 없는 묶음(대기)도 같은 자리에 같은 굵기의 줄을 둔다 — 색으로만 구분한다.
  const full = capacity !== undefined && members.length >= capacity;

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

      {members.length > 0 && (
        <Progress
          value={capacity === undefined ? 1 : Math.min(members.length, capacity)}
          max={capacity ?? 1}
          color={capacity === undefined ? "waiting" : full ? "confirmed" : "recruiting"}
          className="w-full"
        />
      )}

      {members.length === 0 ? (
        emptyText && (
          <Text
            typography="body3"
            foreground="muted"
            render={<p />}
            className="rounded-xl border border-dashed border-gray-300 p-4 text-center"
          >
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
