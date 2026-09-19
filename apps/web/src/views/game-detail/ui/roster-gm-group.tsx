import { RosterGroup } from "./roster-group";
import { RosterMemberRow } from "./roster-member-row";

export type RosterSheetGm = {
  userId: string;
  username?: string;
  avatarUrl?: string | null;
  bio?: string | null;
};

export function RosterGmGroup({ gm, viewerId }: { gm: RosterSheetGm; viewerId: string | null }) {
  return (
    <RosterGroup label="GM">
      <RosterMemberRow
        userId={gm.userId}
        name={gm.username}
        avatarUrl={gm.avatarUrl}
        bio={gm.bio}
        note={gm.userId === viewerId ? "GM · 나" : "GM"}
      />
    </RosterGroup>
  );
}
