import type { ManagedMember } from "../model/managed-member";
import { RosterSection } from "./roster-section";
import { WaitingRosterRow } from "./waiting-roster-row";

// 대기열. 정원이 차 있으면 승격 버튼을 잠그고 왜 잠겼는지 헤더에 적는다.
export function WaitingRoster({
  gameId,
  members,
  isFull,
}: {
  gameId: string;
  members: ManagedMember[];
  isFull: boolean;
}) {
  const hint = isFull ? "정원이 차서 승격하려면 먼저 자리를 비워야 해요" : "상한 없음";

  return (
    <RosterSection title={`대기 ${members.length}명`} hint={hint} boxClassName="bg-gray-50">
      {members.map((member) => (
        <WaitingRosterRow
          key={member.userId}
          gameId={gameId}
          member={member}
          promoteDisabled={isFull}
        />
      ))}
    </RosterSection>
  );
}
