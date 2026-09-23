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

// 추첨 전 신청자에게는 순번이 없다 — 신청 순서로만 보여준다.
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
        <RosterSheetTitle title="명단" />

        <VStack gap="150" className="max-h-[23rem] overflow-y-auto">
          <RosterGmGroup gm={gm} viewerId={viewerId} />
          <RosterGroup label="신청" count={applicants.length}>
            {applicants.map((member) => (
              <RosterSheetRow key={member.userId} member={member} viewerId={viewerId} />
            ))}
          </RosterGroup>
          <Text typography="body4" foreground="hint" render={<p />}>
            추첨 전에는 순번이 없습니다. 신청 순서로만 보여줍니다.
          </Text>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
