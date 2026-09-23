import { type DetailRosterMember, RosterMemberRow } from "./roster-member-row";

interface RosterSheetRowProps {
  member: DetailRosterMember;
  viewerId: string | null;
  rankTag?: string;
}

export function RosterSheetRow({ member, viewerId, rankTag }: RosterSheetRowProps) {
  const tags = [rankTag, member.userId === viewerId ? "나" : undefined].filter(
    (tag): tag is string => Boolean(tag),
  );
  return (
    <RosterMemberRow
      userId={member.userId}
      name={member.user?.username}
      avatarUrl={member.user?.avatarUrl}
      bio={member.user?.bio}
      tags={tags}
    />
  );
}
