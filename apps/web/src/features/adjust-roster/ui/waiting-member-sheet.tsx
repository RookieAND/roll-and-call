"use client";

import { Avatar, HStack, Text, VStack } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import type { MemberSummary } from "../model/member-summary";
import { PromoteMemberItem } from "./promote-member-item";

type WaitingMember = MemberSummary & { waitlistRank: number | null };

// 정원이 찼으면 바로 올릴 수 없어 "교체"(내릴 사람 고르기)로 대신한다.
export function WaitingMemberSheet<Member extends WaitingMember>({
  gameId,
  member,
  isFull,
  onSwap,
  onClose,
}: {
  gameId: string;
  member: Member | null;
  isFull: boolean;
  onSwap: (member: Member) => void;
  onClose: () => void;
}) {
  return (
    <Sheet.Root open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Content>
        {member && (
          <VStack gap={0}>
            <HStack align="center" gap={3} className="border-b border-gray-100 pb-3.5">
              <Avatar src={member.avatarUrl} name={member.username} size="lg" />
              <VStack gap={0}>
                <Text typography="subtitle1">{member.username}</Text>
                <Text typography="body4" foreground="muted">
                  대기 {member.waitlistRank}번 · {member.applicationRank}번째 신청
                </Text>
              </VStack>
            </HStack>

            {isFull ? (
              <Sheet.Item
                onClick={() => {
                  onClose();
                  onSwap(member);
                }}
              >
                교체
                <Text typography="body4" foreground="hint" render={<span />}>
                  내릴 사람을 고릅니다
                </Text>
              </Sheet.Item>
            ) : (
              <PromoteMemberItem gameId={gameId} member={member} onDone={onClose} />
            )}
          </VStack>
        )}
      </Sheet.Content>
    </Sheet.Root>
  );
}
