"use client";

import { Text } from "@trpg/ui";
import { useState } from "react";
import { MemberActionSheet } from "@/features/manage-participants";
import type { ManagedMember } from "../model/managed-member";
import { ConfirmedRosterRow } from "./confirmed-roster-row";
import { RosterSection } from "./roster-section";

// 확정 로스터. 행의 ⋯ 메뉴가 여는 시트(강등·내보내기)는 이 블록이 상태를 쥔다.
export function ConfirmedRoster({
  gameId,
  members,
  maxPlayers,
  waitingHead,
}: {
  gameId: string;
  members: ManagedMember[];
  maxPlayers: number;
  // 빈 자리를 자동으로 채울 대기 1번의 이름
  waitingHead?: string;
}) {
  const [sheetMember, setSheetMember] = useState<ManagedMember | null>(null);

  return (
    <>
      <RosterSection title={`확정 ${members.length}/${maxPlayers}`} hint="신청 순서 기준">
        {members.map((member) => (
          <ConfirmedRosterRow
            key={member.userId}
            member={member}
            onMenu={() => setSheetMember(member)}
          />
        ))}
        {members.length === 0 && (
          <div className="px-3 py-4">
            <Text typography="body3" foreground="muted">
              아직 확정된 참여자가 없어요.
            </Text>
          </div>
        )}
      </RosterSection>

      <MemberActionSheet
        gameId={gameId}
        member={sheetMember}
        waitingHead={waitingHead}
        onClose={() => setSheetMember(null)}
      />
    </>
  );
}
