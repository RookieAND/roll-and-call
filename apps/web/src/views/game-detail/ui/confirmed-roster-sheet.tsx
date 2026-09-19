import { Sheet } from "@/shared/ui";

import { RosterGmGroup, type RosterSheetGm } from "./roster-gm-group";
import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";

export function ConfirmedRosterSheet({
  open,
  onOpenChange,
  gm,
  confirmed,
  viewerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gm: RosterSheetGm;
  confirmed: DetailRosterMember[];
  viewerId: string | null;
}) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title className="mb-3">참여자 명단</Sheet.Title>

        <div className="max-h-[60vh] divide-y divide-gray-200 overflow-y-auto [&>*+*]:mt-3 [&>*+*]:pt-3">
          <RosterGmGroup gm={gm} viewerId={viewerId} />
          <RosterGroup label="참여" count={confirmed.length}>
            {confirmed.map((member) => (
              <RosterSheetRow key={member.userId} member={member} viewerId={viewerId} />
            ))}
          </RosterGroup>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
