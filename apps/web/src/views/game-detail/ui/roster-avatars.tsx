import { AvatarGroup } from "@roll-and-call/ui";

import type { DetailRosterMember } from "./roster-member-row";

const MAX_AVATARS = 3;

interface RosterAvatarsProps {
  members: DetailRosterMember[];
}

export function RosterAvatars({ members }: RosterAvatarsProps) {
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
