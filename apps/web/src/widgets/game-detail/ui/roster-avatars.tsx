import { AvatarGroup } from "@roll-and-call/ui";

import type { DetailRosterMember } from "./roster-member-row";

const MAX_AVATARS = 3;
const MAX_AVATARS_DESKTOP = 10;

interface RosterAvatarsProps {
  members: DetailRosterMember[];
}

export function RosterAvatars({ members }: RosterAvatarsProps) {
  const people = members.map((member) => ({
    src: member.user?.avatarUrl,
    name: member.user?.username,
  }));
  return (
    <>
      <AvatarGroup max={MAX_AVATARS} size="md" people={people} className="desktop:hidden" />
      <AvatarGroup
        max={MAX_AVATARS_DESKTOP}
        size="md"
        people={people}
        className="hidden desktop:flex"
      />
    </>
  );
}
