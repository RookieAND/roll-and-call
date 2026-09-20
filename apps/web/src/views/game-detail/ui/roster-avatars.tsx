import { AvatarGroup } from "@trpg/ui";

import type { DetailRosterMember } from "./roster-member-row";

const MAX_AVATARS = 5;

export function RosterAvatars({ members }: { members: DetailRosterMember[] }) {
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
