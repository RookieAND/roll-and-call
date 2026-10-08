import { Sheet } from "@roll-and-call/ui";

import { ExpandableRows } from "@/shared/ui";

import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";
import { RosterSheetTitle } from "./roster-sheet-title";

interface WaitingRosterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waiting: DetailRosterMember[];
  viewerId: string | null;
}

export function WaitingRosterSheet({
  open,
  onOpenChange,
  waiting,
  viewerId,
}: WaitingRosterSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Popup>
        <Sheet.Handle />
        <RosterSheetTitle title="대기자 명단" count={waiting.length} />

        <div className="max-h-[23rem] overflow-y-auto">
          <RosterGroup>
            <ExpandableRows previewCount={2}>
              {waiting.map((member) => (
                <RosterSheetRow
                  key={member.userId}
                  member={member}
                  viewerId={viewerId}
                  rankTag={`대기 ${member.waitlistRank}번`}
                />
              ))}
            </ExpandableRows>
          </RosterGroup>
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
