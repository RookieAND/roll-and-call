import { Avatar, HStack, Text, VStack, cn } from "@trpg/ui";

import type { MemberSummary } from "../model/member-summary";

export function MemberSheetHeader({
  member,
  isCoordinate,
}: {
  member: MemberSummary;
  isCoordinate: boolean;
}) {
  const queue = member.waitlistRank === null ? "확정" : `대기 ${member.waitlistRank}번`;
  const availability = member.hasAvailability ? "가능 시간 제출" : "가능 시간 미제출";
  const unsubmitted = isCoordinate && !member.hasAvailability;

  return (
    <HStack align="center" gap="150" className="border-b border-gray-100 pb-175">
      <Avatar src={member.avatarUrl} name={member.username} size="lg" />
      <VStack gap={0}>
        <Text typography="subtitle1">{member.username}</Text>
        <Text
          typography="body4"
          foreground="muted"
          className={cn(unsubmitted && "text-warning-600")}
        >
          {isCoordinate ? `${queue} · ${availability}` : queue}
        </Text>
      </VStack>
    </HStack>
  );
}
