import { Sheet } from "@roll-and-call/ui";

import { RosterGmGroup, type RosterSheetGm } from "./roster-gm-group";
import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";

interface ConfirmedRosterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gm: RosterSheetGm;
  confirmed: DetailRosterMember[];
  viewerId: string | null;
}

export function ConfirmedRosterSheet({
  open,
  onOpenChange,
  gm,
  confirmed,
  viewerId,
}: ConfirmedRosterSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-150">참여자 명단</Sheet.Title>

        <div className="max-h-[23rem] divide-y divide-gray-200 overflow-y-auto [&>*:not(:last-child)]:pb-150 [&>*+*]:pt-150">
          <RosterGmGroup gm={gm} viewerId={viewerId} />
          <RosterGroup label="참여" count={confirmed.length}>
            {confirmed.map((member) => (
              <RosterSheetRow key={member.userId} member={member} viewerId={viewerId} />
            ))}
          </RosterGroup>
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
