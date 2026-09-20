import { type DetailRosterMember, RosterMemberRow } from "./roster-member-row";

interface RosterSheetRowProps {
  member: DetailRosterMember;
  viewerId: string | null;
  rankNote?: string;
}

export function RosterSheetRow({ member, viewerId, rankNote }: RosterSheetRowProps) {
  const mine = member.userId === viewerId ? "나" : null;
  return (
    <RosterMemberRow
      userId={member.userId}
      name={member.user?.username}
      avatarUrl={member.user?.avatarUrl}
      bio={member.user?.bio}
      note={[rankNote, mine].filter(Boolean).join(" · ") || undefined}
    />
  );
}
