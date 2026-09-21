import { Text } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import { RosterGmGroup, type RosterSheetGm } from "./roster-gm-group";
import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";

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
      <Sheet.Content>
        <Sheet.Title className="mb-150">명단</Sheet.Title>

        <div className="max-h-[60vh] divide-y divide-gray-200 overflow-y-auto [&>*:not(:last-child)]:pb-150 [&>*+*]:pt-150">
          <RosterGmGroup gm={gm} viewerId={viewerId} />
          <RosterGroup label="신청" count={applicants.length}>
            {applicants.map((member) => (
              <RosterSheetRow key={member.userId} member={member} viewerId={viewerId} />
            ))}
          </RosterGroup>
          <Text typography="body4" foreground="hint" render={<p />} className="pt-100">
            추첨 전에는 순번이 없습니다. 신청 순서로만 보여줍니다.
          </Text>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
