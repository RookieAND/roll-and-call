import { Text } from "@trpg/ui";

import type { ManagedMember } from "../model/managed-member";
import { MemberMenuButton } from "./member-menu-button";
import { MemberProfileLink } from "./member-profile-link";
import { ROSTER_ROW_CLASS } from "./roster-row-class";

export function WaitingRosterRow({
  member,
  locked,
  onOpenMenu,
}: {
  member: ManagedMember;
  locked: boolean;
  onOpenMenu: (member: ManagedMember) => void;
}) {
  return (
    <div className={ROSTER_ROW_CLASS}>
      <MemberProfileLink
        member={member}
        note={
          <Text typography="body4" foreground="muted" className="block">
            대기 {member.waitlistRank}번
          </Text>
        }
      />
      {!locked && (
        <MemberMenuButton username={member.username} onClick={() => onOpenMenu(member)} />
      )}
    </div>
  );
}
