"use client";

import { VStack } from "@roll-and-call/ui";

import { Sheet } from "@/shared/ui";

import type { MemberSummary } from "../model/member-summary";
import { DemoteMemberItem } from "./demote-member-item";
import { MemberSheetHeader } from "./member-sheet-header";
import { PromoteMemberItem } from "./promote-member-item";
import { RemoveMemberItem } from "./remove-member-item";

interface MemberSheetProps {
  gameId: string;
  member: MemberSummary | null;
  confirmedCount: number;
  waitingCount: number;
  maxPlayers: number;
  isCoordinate: boolean;
  beforeDraw: boolean;
  onClose: () => void;
}

// 큐가 다르면 첫 줄만 다르다. 할 수 있는 일은 언제나 둘 — 반대 큐로 옮기기와 내보내기.
export function MemberSheet({
  gameId,
  member,
  confirmedCount,
  waitingCount,
  maxPlayers,
  isCoordinate,
  beforeDraw,
  onClose,
}: MemberSheetProps) {
  const isConfirmed = member?.waitlistRank === null;

  return (
    <Sheet.Root open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Content>
        {member && (
          <VStack gap={0}>
            <MemberSheetHeader
              member={member}
              isCoordinate={isCoordinate}
              beforeDraw={beforeDraw}
            />
            {isConfirmed ? (
              <DemoteMemberItem
                gameId={gameId}
                member={member}
                waitingCount={waitingCount}
                beforeDraw={beforeDraw}
                onDone={onClose}
              />
            ) : (
              <PromoteMemberItem
                gameId={gameId}
                member={member}
                confirmedCount={confirmedCount}
                maxPlayers={maxPlayers}
                onDone={onClose}
              />
            )}
            <RemoveMemberItem
              gameId={gameId}
              member={member}
              leavesEmptySeat={isConfirmed && waitingCount > 0 && !beforeDraw}
              onDone={onClose}
            />
          </VStack>
        )}
      </Sheet.Content>
    </Sheet.Root>
  );
}
