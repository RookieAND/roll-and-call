"use client";

import { VStack, Sheet } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import type { MemberSummary } from "../model/member-summary";
import type { RosterContext } from "../model/roster-context";
import { DemoteMemberItem } from "./demote-member-item";
import { MarkAbsentMemberItem } from "./mark-absent-member-item";
import { MemberSheetHeader } from "./member-sheet-header";
import { PromoteMemberItem } from "./promote-member-item";
import { RemoveMemberItem } from "./remove-member-item";

interface MemberSheetProps {
  roster: RosterContext;
  member: MemberSummary | null;
  onMarkAbsent: (member: MemberSummary) => void;
  onClose: () => void;
}

export function MemberSheet({ roster, member, onMarkAbsent, onClose }: MemberSheetProps) {
  const {
    gameId,
    confirmedCount,
    waitingCount,
    maxPlayers,
    isCoordinate,
    beforeDraw,
    selectionOpen,
    started,
    capacityRaised,
  } = roster;
  const isConfirmed = isNull(member?.waitlistRank);

  return (
    <Sheet.Root open={!isNull(member)} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Popup>
        <Sheet.Handle />
        {member && (
          <VStack gap={0}>
            <MemberSheetHeader
              member={member}
              isCoordinate={isCoordinate}
              beforeDraw={beforeDraw}
              started={started}
            />
            {isConfirmed && !started && (
              <DemoteMemberItem
                gameId={gameId}
                member={member}
                waitingCount={waitingCount}
                beforeDraw={beforeDraw}
                selectionOpen={selectionOpen}
                onDone={onClose}
              />
            )}
            {!isConfirmed && (
              <PromoteMemberItem
                gameId={gameId}
                member={member}
                confirmedCount={confirmedCount}
                maxPlayers={maxPlayers}
                started={started}
                capacityRaised={capacityRaised}
                onDone={onClose}
              />
            )}
            {isConfirmed && started ? (
              <MarkAbsentMemberItem
                onSelect={() => {
                  onClose();
                  onMarkAbsent(member);
                }}
              />
            ) : (
              <RemoveMemberItem
                gameId={gameId}
                member={member}
                leavesEmptySeat={isConfirmed && waitingCount > 0 && !beforeDraw}
                notifies={!started}
                onDone={onClose}
              />
            )}
          </VStack>
        )}
      </Sheet.Popup>
    </Sheet.Root>
  );
}
