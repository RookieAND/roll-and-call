import { Text } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import { RosterGmGroup, type RosterSheetGm } from "./roster-gm-group";
import { RosterGroup } from "./roster-group";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetRow } from "./roster-sheet-row";

// 추첨은 뽑기 전까지 확정과 대기를 가르지 않는다 — 한 덩어리의 "신청"으로 본다.
export function LotteryRosterSheet({
  open,
  onOpenChange,
  gm,
  applicants,
  viewerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gm: RosterSheetGm;
  applicants: DetailRosterMember[];
  viewerId: string | null;
}) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title className="mb-150">명단</Sheet.Title>

        <div className="max-h-[60vh] divide-y divide-gray-200 overflow-y-auto [&>*+*]:mt-150 [&>*+*]:pt-150">
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
