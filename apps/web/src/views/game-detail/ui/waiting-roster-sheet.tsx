import { Text } from "@trpg/ui";

import { ExpandableRows, Sheet } from "@/shared/ui";

import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";

export function WaitingRosterSheet({
  open,
  onOpenChange,
  waiting,
  viewerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waiting: DetailRosterMember[];
  viewerId: string | null;
}) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title className="mb-150">
          대기자 명단
          <Text
            typography="body4"
            foreground="hint"
            render={<span />}
            className="ml-100 tabular-nums"
          >
            {waiting.length}명
          </Text>
        </Sheet.Title>

        <div className="max-h-[60vh] divide-y divide-gray-200 overflow-y-auto">
          <ExpandableRows>
            {waiting.map((member) => (
              <RosterSheetRow
                key={member.userId}
                member={member}
                viewerId={viewerId}
                rankNote={`대기 ${member.waitlistRank}번`}
              />
            ))}
          </ExpandableRows>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
