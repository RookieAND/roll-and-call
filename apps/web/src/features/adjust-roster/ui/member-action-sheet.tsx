"use client";

import { Avatar, HStack, Text, VStack } from "@trpg/ui";
import { Sheet } from "@/shared/ui";
import type { MemberSummary } from "../model/member-summary";
import { DemoteMemberItem } from "./demote-member-item";
import { RemoveMemberItem } from "./remove-member-item";

// 확정 참여자 ⋯ 메뉴. 열림 상태는 호출부가 member로 제어하고,
// 각 동작은 자기 진행 상태와 확인 절차를 직접 들고 있다.
export function MemberActionSheet({
  gameId,
  member,
  waitingHead,
  onClose,
}: {
  gameId: string;
  member: MemberSummary | null;
  // 빈 자리를 자동으로 채울 대기 1번의 이름(없으면 안내 생략)
  waitingHead?: string;
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
                  확정 예정 · {member.applicationRank}번째 신청
                </Text>
              </VStack>
            </HStack>

            <DemoteMemberItem gameId={gameId} member={member} onDone={onClose} />
            <RemoveMemberItem gameId={gameId} member={member} onDone={onClose} />

            {waitingHead && (
              <div className="mt-1.5 rounded-xl bg-gray-50 px-3 py-3">
                <Text typography="body4" foreground="muted" render={<p />}>
                  빈 자리는 대기 맨 앞({waitingHead})이 자동으로 채웁니다.
                </Text>
              </div>
            )}
          </VStack>
        )}
      </Sheet.Content>
    </Sheet.Root>
  );
}
