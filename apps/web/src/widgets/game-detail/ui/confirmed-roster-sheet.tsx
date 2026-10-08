import { Sheet, VStack } from "@roll-and-call/ui";

import { RosterGmGroup, type RosterSheetGm } from "./roster-gm-group";
import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";
import { RosterSheetTitle } from "./roster-sheet-title";

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
        <RosterSheetTitle title="참여자 명단" />

        <VStack gap="150" className="max-h-[23rem] overflow-y-auto">
          <RosterGmGroup gm={gm} viewerId={viewerId} />
          <RosterGroup label="참여" count={confirmed.length}>
            {confirmed.map((member) => (
              <RosterSheetRow key={member.userId} member={member} viewerId={viewerId} />
            ))}
          </RosterGroup>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
