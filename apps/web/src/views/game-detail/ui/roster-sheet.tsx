import { Text } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import { type DetailRosterMember, RosterMemberRow } from "./roster-member-row";

export function RosterSheet({
  open,
  onOpenChange,
  confirmed,
  waiting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
}) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title>명단 · 신청 순서</Sheet.Title>
        <div className="max-h-[60vh] overflow-y-auto">
          {confirmed.map((member) => (
            <RosterMemberRow key={member.userId} rank={member.applicationRank} member={member} />
          ))}
          {waiting.length > 0 && (
            <Text typography="subtitle2" foreground="muted" render={<div />} className="pt-3 pb-1">
              대기
            </Text>
          )}
          {waiting.map((member) => (
            <RosterMemberRow
              key={member.userId}
              rank={member.applicationRank}
              member={member}
              note={`대기 ${member.waitlistRank}번`}
            />
          ))}
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
