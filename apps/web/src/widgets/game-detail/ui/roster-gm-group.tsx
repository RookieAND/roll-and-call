import { RosterGroup } from "./roster-group";
import { RosterMemberRow } from "./roster-member-row";

export type RosterSheetGm = {
  userId: string;
  username?: string;
  avatarUrl?: string | null;
  bio?: string | null;
};

interface RosterGmGroupProps {
  gm: RosterSheetGm;
  viewerId: string | null;
}

export function RosterGmGroup({ gm, viewerId }: RosterGmGroupProps) {
  return (
    <RosterGroup label="GM">
      <RosterMemberRow
        userId={gm.userId}
        name={gm.username}
        avatarUrl={gm.avatarUrl}
        bio={gm.bio}
        tags={gm.userId === viewerId ? ["GM", "나"] : ["GM"]}
      />
    </RosterGroup>
  );
}
