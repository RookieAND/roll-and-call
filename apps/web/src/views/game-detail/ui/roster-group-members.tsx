import { AvatarGroup, Text } from "@trpg/ui";

import type { DetailRosterMember } from "./roster-member-row";

const MAX_AVATARS = 5;

export function RosterGroupMembers({
  members,
  emptyText,
}: {
  members: DetailRosterMember[];
  emptyText?: string;
}) {
  if (members.length > 0) {
    return (
      <AvatarGroup
        max={MAX_AVATARS}
        size="stack"
        people={members.map((member) => ({
          src: member.user?.avatarUrl,
          name: member.user?.username,
        }))}
      />
    );
  }

  if (!emptyText) return null;
  return (
    <Text
      typography="body3"
      foreground="muted"
      render={<p />}
      className="rounded-xl border border-dashed border-gray-300 p-4 text-center"
    >
      {emptyText}
    </Text>
  );
}
