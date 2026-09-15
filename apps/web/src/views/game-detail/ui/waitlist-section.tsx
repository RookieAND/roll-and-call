import { Badge, HStack, Text } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";

import { type DetailRosterMember, RosterMemberRow } from "./roster-member-row";

export function WaitlistSection({
  waiting,
  viewerId,
  endDate,
}: {
  waiting: DetailRosterMember[];
  viewerId: string | null;
  endDate: Date;
}) {
  return (
    <section className="flex flex-col gap-1">
      <HStack align="center" gap={2}>
        <Text typography="heading3" render={<h2 />}>
          대기
        </Text>
        <Badge color="gray">{waiting.length}명</Badge>
        <span className="flex-1" />
        <Text typography="body4" foreground="hint">
          자리가 나면 순서대로 확정
        </Text>
      </HStack>
      <div>
        {waiting.map((member) => {
          const note =
            member.userId === viewerId ? `나 · 마감 ${formatDateTime(endDate)}까지` : undefined;
          return (
            <RosterMemberRow
              key={member.userId}
              rank={member.waitlistRank!}
              member={member}
              note={note}
            />
          );
        })}
      </div>
    </section>
  );
}
