import { Sheet, Text, VStack } from "@roll-and-call/ui";

import { RosterGmGroup, type RosterSheetGm } from "./roster-gm-group";
import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";
import { RosterSheetTitle } from "./roster-sheet-title";

interface LotteryRosterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gm: RosterSheetGm;
  applicants: DetailRosterMember[];
  viewerId: string | null;
}

export function LotteryRosterSheet({
  open,
  onOpenChange,
  gm,
  applicants,
  viewerId,
}: LotteryRosterSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Popup>
        <Sheet.Handle />
        <RosterSheetTitle title="참여 신청자 명단" />

        <VStack gap="150" className="max-h-[23rem] overflow-y-auto">
          <RosterGmGroup gm={gm} viewerId={viewerId} />
          <RosterGroup label="신청" count={applicants.length}>
            {applicants.map((member) => (
              <RosterSheetRow key={member.userId} member={member} viewerId={viewerId} />
            ))}
          </RosterGroup>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
