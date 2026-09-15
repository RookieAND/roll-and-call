"use client";

import { Text } from "@trpg/ui";
import { useState } from "react";

import { MemberActionSheet, SwapSheet } from "@/features/adjust-roster";

import type { ManagedMember } from "../model/managed-member";
import { CapacityDivider } from "./capacity-divider";
import { ConfirmedRosterRow } from "./confirmed-roster-row";
import { WaitingRosterRow } from "./waiting-roster-row";

export function RosterList({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  isFull,
  isCoordinate,
  locked,
}: {
  gameId: string;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  isFull: boolean;
  isCoordinate: boolean;
  locked: boolean;
}) {
  const [menuMember, setMenuMember] = useState<ManagedMember | null>(null);
  const [incoming, setIncoming] = useState<ManagedMember | null>(null);

  const total = confirmed.length + waiting.length;
  // 빈 자리를 채울 사람 = 대기 맨 앞(서버의 promoteWaitlistHead와 같은 기준)
  const waitlistHead = waiting[0];
  const filler = waitlistHead
    ? { userId: waitlistHead.userId, username: waitlistHead.username }
    : undefined;
  const scheduleHref = isCoordinate ? `/games/${gameId}/schedule` : null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Text typography="body3" foreground="muted" render={<h2 />} className="font-bold">
          신청 순서 명단 {total}명
        </Text>
        <Text typography="body3" foreground="muted">
          정원 {maxPlayers}명
        </Text>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        {confirmed.map((member) => (
          <ConfirmedRosterRow
            key={member.userId}
            member={member}
            waiting={waiting}
            isCoordinate={isCoordinate}
            locked={locked}
            onOpenMenu={setMenuMember}
          />
        ))}
        {confirmed.length === 0 && (
          <div className="px-3 py-4">
            <Text typography="body3" foreground="muted">
              아직 확정된 참여자가 없습니다.
            </Text>
          </div>
        )}

        {waiting.length > 0 && (
          <>
            <CapacityDivider maxPlayers={maxPlayers} />
            <div className="bg-gray-50">
              {waiting.map((member) => (
                <WaitingRosterRow
                  key={member.userId}
                  gameId={gameId}
                  member={member}
                  isFull={isFull}
                  locked={locked}
                  onSwap={setIncoming}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <MemberActionSheet
        gameId={gameId}
        member={menuMember}
        filler={filler}
        scheduleHref={scheduleHref}
        onClose={() => setMenuMember(null)}
      />
      <SwapSheet
        gameId={gameId}
        incoming={incoming}
        candidates={confirmed}
        maxPlayers={maxPlayers}
        isCoordinate={isCoordinate}
        onClose={() => setIncoming(null)}
      />
    </section>
  );
}
